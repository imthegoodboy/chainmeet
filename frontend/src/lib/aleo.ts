// Aleo SDK Integration
// Using Puzzle Wallet SDK for wallet integration
// Contract interactions handled via Puzzle Wallet's requestCreateEvent

import { PuzzleWalletService } from "./puzzle";

export interface AleoConfig {
  network: "testnet" | "mainnet";
  rpcUrl: string;
  meetingProgramId: string;
  eligibilityProgramId: string;
  attendanceProgramId: string;
}

export class AleoService {
  private config: AleoConfig;
  private walletService: PuzzleWalletService;

  constructor(config: AleoConfig) {
    this.config = config;
    this.walletService = PuzzleWalletService.getInstance();
  }

  /**
   * Format a string input for Leo (converts to field)
   */
  private formatStringInput(str: string, maxLen: number = 32): string {
    // Convert string to bytes and then to a field representation
    // For simplicity, we'll use a hash-like representation
    const bytes = new TextEncoder().encode(str.slice(0, maxLen));
    let hash = 0n;
    for (let i = 0; i < bytes.length; i++) {
      hash = (hash << 8n) | BigInt(bytes[i]);
    }
    return `${hash}field`;
  }

  /**
   * Format a number as u64
   */
  private formatU64(num: number): string {
    return `${num}u64`;
  }

  /**
   * Format an address (already in Aleo format)
   */
  private formatAddress(address: string): string {
    return address; // Aleo addresses are already properly formatted
  }

  /**
   * Create a new meeting on-chain
   */
  public async createMeeting(params: {
    name: string;
    description: string;
    ruleHash: string;
    startTime: number;
    endTime: number;
    metadataCid: string;
  }): Promise<string> {
    const accounts = await this.walletService.getAccounts();
    if (accounts.length === 0) {
      throw new Error("Wallet not connected. Please connect your wallet first.");
    }

    try {
      // Format inputs for Leo contract
      // The create_meeting function expects: organizer address, name hash, rule hash, start_time, end_time, metadata_cid
      const inputs = [
        this.formatAddress(accounts[0]),           // organizer
        this.formatStringInput(params.name),       // name (as field)
        this.formatStringInput(params.ruleHash),   // rule_hash (as field)
        this.formatU64(params.startTime),          // start_time
        this.formatU64(params.endTime),            // end_time
        this.formatStringInput(params.metadataCid) // metadata_cid (as field)
      ];

      const result = await this.walletService.executeTransaction({
        programId: this.config.meetingProgramId,
        functionId: "create_meeting",
        inputs,
        fee: 500000, // 0.5 credits for meeting creation
      });

      if (!result.success) {
        throw new Error(result.error || "Transaction failed");
      }

      return result.eventId;
    } catch (error: any) {
      console.error("Create meeting error:", error);
      throw new Error(`Failed to create meeting: ${error.message}`);
    }
  }

  /**
   * Verify eligibility for a meeting
   */
  public async verifyEligibility(params: {
    meetingId: string;
    ruleType: "nft" | "token" | "dao" | "custom";
    proof: string;
    contractHash?: string;
    minBalance?: number;
  }): Promise<string> {
    const accounts = await this.walletService.getAccounts();
    if (accounts.length === 0) {
      throw new Error("Wallet not connected");
    }

    let functionName = "";
    const inputs: string[] = [this.formatU64(parseInt(params.meetingId))];

    switch (params.ruleType) {
      case "nft":
        functionName = "verify_nft_ownership";
        inputs.push(
          this.formatStringInput(params.contractHash || ""),
          this.formatStringInput(params.proof),
          this.formatU64(params.minBalance || 1)
        );
        break;
      case "token":
        functionName = "verify_token_balance";
        inputs.push(
          this.formatStringInput(params.contractHash || ""),
          this.formatStringInput(params.proof),
          this.formatU64(params.minBalance || 0)
        );
        break;
      case "dao":
        functionName = "verify_dao_membership";
        inputs.push(
          this.formatStringInput(params.contractHash || ""),
          this.formatStringInput(params.proof)
        );
        break;
      case "custom":
        functionName = "verify_custom_rule";
        inputs.push(
          this.formatStringInput(params.contractHash || ""),
          this.formatStringInput(params.proof)
        );
        break;
    }

    try {
      const result = await this.walletService.executeTransaction({
        programId: this.config.eligibilityProgramId,
        functionId: functionName,
        inputs,
        fee: 300000, // 0.3 credits
      });

      if (!result.success) {
        throw new Error(result.error || "Verification failed");
      }

      return result.eventId;
    } catch (error: any) {
      console.error("Verify eligibility error:", error);
      throw new Error(`Failed to verify eligibility: ${error.message}`);
    }
  }

  /**
   * Record attendance for a meeting
   */
  public async recordAttendance(meetingId: string): Promise<string> {
    const accounts = await this.walletService.getAccounts();
    if (accounts.length === 0) {
      throw new Error("Wallet not connected");
    }

    try {
      const result = await this.walletService.executeTransaction({
        programId: this.config.attendanceProgramId,
        functionId: "record_attendance",
        inputs: [
          this.formatU64(parseInt(meetingId)),
          this.formatAddress(accounts[0])
        ],
        fee: 200000, // 0.2 credits
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to record attendance");
      }

      return result.eventId;
    } catch (error: any) {
      console.error("Record attendance error:", error);
      throw new Error(`Failed to record attendance: ${error.message}`);
    }
  }

  /**
   * Query meeting data from the Aleo network
   */
  public async getMeeting(meetingId: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.config.rpcUrl}/program/${this.config.meetingProgramId}/mapping/meetings/${meetingId}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch meeting");
      }
      return await response.json();
    } catch (error: any) {
      console.error("Get meeting error:", error);
      return null;
    }
  }

  /**
   * Get user's meeting count from on-chain data
   */
  public async getUserMeetingCount(address: string): Promise<number> {
    try {
      const response = await fetch(
        `${this.config.rpcUrl}/program/${this.config.attendanceProgramId}/mapping/user_meeting_count/${address}`
      );
      if (!response.ok) {
        return 0;
      }
      const data = await response.json();
      // Parse the u64 value
      const match = String(data).match(/(\d+)u64/);
      return match ? parseInt(match[1]) : 0;
    } catch (error) {
      console.debug("Get user meeting count error:", error);
      return 0;
    }
  }

  /**
   * Get program info
   */
  public getConfig(): AleoConfig {
    return this.config;
  }
}

// Initialize Aleo service with environment variables
// Default to deployed ChainMeet contracts on Aleo Testnet
export const aleoService = new AleoService({
  network: (process.env.NEXT_PUBLIC_ALEO_NETWORK as "testnet" | "mainnet") || "testnet",
  rpcUrl: process.env.NEXT_PUBLIC_ALEO_RPC_URL || "https://api.explorer.provable.com/v2",
  meetingProgramId: process.env.NEXT_PUBLIC_MEETING_PROGRAM_ID || "meeting_chainmeet_7879.aleo",
  eligibilityProgramId: process.env.NEXT_PUBLIC_ELIGIBILITY_PROGRAM_ID || "eligibility_chainmeet_8903.aleo",
  attendanceProgramId: process.env.NEXT_PUBLIC_ATTENDANCE_PROGRAM_ID || "attendance_chainmeet_1735.aleo",
});
