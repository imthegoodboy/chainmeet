// Puzzle Wallet Integration
// Using official @puzzlehq/sdk-core

import { 
  connect as puzzleConnect, 
  getAccount,
  requestCreateEvent,
  requestSignature as puzzleRequestSignature,
  EventType,
  Network
} from "@puzzlehq/sdk-core";

declare global {
  interface Window {
    aleo?: {
      puzzleWalletClient?: {
        connect?: { mutate: (request: any) => Promise<any> };
        getSelectedAccount?: { query: (request: any) => Promise<any> };
        disconnect?: { mutate: (request: any) => Promise<any> };
        requestSignature?: { mutate: (request: any) => Promise<any> };
        requestCreateEvent?: { mutate: (request: any) => Promise<any> };
        [key: string]: any;
      };
      [key: string]: any;
    };
    puzzle?: any;
  }
}

// Program IDs for permissions
const MEETING_PROGRAM_ID = process.env.NEXT_PUBLIC_MEETING_PROGRAM_ID || "meeting_chainmeet_7879.aleo";
const ELIGIBILITY_PROGRAM_ID = process.env.NEXT_PUBLIC_ELIGIBILITY_PROGRAM_ID || "eligibility_chainmeet_8903.aleo";
const ATTENDANCE_PROGRAM_ID = process.env.NEXT_PUBLIC_ATTENDANCE_PROGRAM_ID || "attendance_chainmeet_1735.aleo";

// Default fee for transactions (in microcredits)
const DEFAULT_FEE = 100000; // 0.1 Aleo credits

export interface TransactionParams {
  programId: string;
  functionId: string;
  inputs: string[];
  fee?: number;
}

export interface TransactionResult {
  eventId: string;
  success: boolean;
  error?: string;
}

export class PuzzleWalletService {
  private static instance: PuzzleWalletService;
  private connected: boolean = false;
  private account: string | null = null;
  private network: Network = Network.AleoTestnet;

  private constructor() {}

  public static getInstance(): PuzzleWalletService {
    if (!PuzzleWalletService.instance) {
      PuzzleWalletService.instance = new PuzzleWalletService();
    }
    return PuzzleWalletService.instance;
  }

  /**
   * Check if Puzzle Wallet extension is properly injected
   */
  private hasPuzzleWalletClient(): boolean {
    if (typeof window === "undefined") {
      return false;
    }
    return !!window?.aleo?.puzzleWalletClient;
  }

  /**
   * Wait for Puzzle Wallet to be injected (with timeout)
   */
  private async waitForPuzzleWallet(timeoutMs: number = 3000): Promise<boolean> {
    const startTime = Date.now();
    
    while (!this.hasPuzzleWalletClient()) {
      if (Date.now() - startTime > timeoutMs) {
        return false;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    
    return true;
  }

  /**
   * Check if Puzzle Wallet is available
   */
  public isAvailable(): boolean {
    return this.hasPuzzleWalletClient();
  }

  /**
   * Async check for wallet availability with wait
   */
  public async checkAvailability(): Promise<boolean> {
    if (this.hasPuzzleWalletClient()) {
      return true;
    }
    return await this.waitForPuzzleWallet(2000);
  }

  /**
   * Connect to Puzzle Wallet using the official SDK
   */
  public async connect(): Promise<string[]> {
    try {
      const isAvailable = await this.waitForPuzzleWallet(5000);
      
      if (!isAvailable) {
        throw new Error(
          "Puzzle Wallet not detected. Please install the Puzzle Wallet extension from https://puzzle.online and refresh the page."
        );
      }

      if (process.env.NODE_ENV === "development") {
        console.log("🔍 Puzzle Wallet Debug:", {
          hasAleo: !!window.aleo,
          hasPuzzleClient: !!window.aleo?.puzzleWalletClient,
          hasConnect: !!window.aleo?.puzzleWalletClient?.connect,
          hasCreateEvent: !!window.aleo?.puzzleWalletClient?.requestCreateEvent,
        });
      }

      const connectResponse = await puzzleConnect({
        dAppInfo: {
          name: "ChainMeet",
          description: "Privacy-First Web3 Meetings on Aleo",
          iconUrl: typeof window !== "undefined" 
            ? `${window.location.origin}/icon.svg` 
            : "",
        },
        permissions: {
          programIds: {
            [Network.AleoTestnet]: [
              MEETING_PROGRAM_ID,
              ELIGIBILITY_PROGRAM_ID,
              ATTENDANCE_PROGRAM_ID,
            ],
          },
        },
      });

      if (process.env.NODE_ENV === "development") {
        console.log("✅ Connect response:", connectResponse);
      }

      if (connectResponse?.connection?.address) {
        this.connected = true;
        this.account = connectResponse.connection.address;
        this.network = connectResponse.connection.network as Network || Network.AleoTestnet;
        return [connectResponse.connection.address];
      }

      const accountData = await this.getAccountFromSDK();
      if (accountData) {
        this.connected = true;
        this.account = accountData;
        return [accountData];
      }

      throw new Error("Connection succeeded but no account address was returned.");
    } catch (error: any) {
      console.error("❌ Wallet connect error:", error);
      this.connected = false;
      this.account = null;
      
      let errorMessage = error.message || "Unknown error";
      
      if (errorMessage.includes("not detected") || errorMessage.includes("5 seconds")) {
        errorMessage = "Puzzle Wallet not detected. Please make sure:\n" +
          "1. Puzzle Wallet extension is installed\n" +
          "2. The extension is enabled in your browser\n" +
          "3. Try refreshing the page";
      } else if (errorMessage.includes("rejected") || errorMessage.includes("denied")) {
        errorMessage = "Connection was rejected. Please approve the connection request in your Puzzle Wallet.";
      } else if (errorMessage.includes("locked")) {
        errorMessage = "Puzzle Wallet is locked. Please unlock your wallet and try again.";
      }
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get account address from SDK
   */
  private async getAccountFromSDK(): Promise<string | null> {
    try {
      const accountData = await getAccount();
      if (accountData && typeof accountData === "object") {
        const address = (accountData as any).address;
        if (address) {
          return address;
        }
      }
      return null;
    } catch (error) {
      console.debug("getAccount error:", error);
      return null;
    }
  }

  /**
   * Get connected accounts
   */
  public async getAccounts(): Promise<string[]> {
    try {
      if (this.account) {
        return [this.account];
      }

      if (!this.hasPuzzleWalletClient()) {
        return [];
      }

      const address = await this.getAccountFromSDK();
      if (address) {
        this.account = address;
        this.connected = true;
        return [address];
      }

      return [];
    } catch (error) {
      console.debug("Get accounts error:", error);
      return [];
    }
  }

  /**
   * Request a signature from the wallet using official SDK
   */
  public async requestSignature(message: string): Promise<string> {
    if (!this.hasPuzzleWalletClient()) {
      throw new Error("Wallet not connected");
    }

    try {
      const response = await puzzleRequestSignature({
        message,
        address: this.account || undefined,
        network: this.network,
      });
      
      return response.signature;
    } catch (error: any) {
      console.error("Signature request error:", error);
      throw new Error(`Failed to sign message: ${error.message || "Unknown error"}`);
    }
  }

  /**
   * Execute a transaction on-chain using Puzzle SDK's requestCreateEvent
   */
  public async executeTransaction(params: TransactionParams): Promise<TransactionResult> {
    if (!this.hasPuzzleWalletClient()) {
      throw new Error("Wallet not connected");
    }

    if (!this.account) {
      throw new Error("No account connected");
    }

    try {
      if (process.env.NODE_ENV === "development") {
        console.log("📝 Executing transaction:", {
          programId: params.programId,
          functionId: params.functionId,
          inputs: params.inputs,
          fee: params.fee || DEFAULT_FEE,
        });
      }

      const response = await requestCreateEvent({
        type: EventType.Execute,
        programId: params.programId,
        functionId: params.functionId,
        fee: params.fee || DEFAULT_FEE,
        inputs: params.inputs,
        address: this.account,
        network: this.network,
      });

      if (process.env.NODE_ENV === "development") {
        console.log("✅ Transaction response:", response);
      }

      if (response.error) {
        throw new Error(response.error);
      }

      return {
        eventId: response.eventId || "",
        success: true,
      };
    } catch (error: any) {
      console.error("Transaction execution error:", error);
      throw new Error(`Transaction failed: ${error.message || "Unknown error"}`);
    }
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    return this.connected && this.account !== null;
  }

  /**
   * Get wallet type info
   */
  public getWalletType(): string {
    if (this.hasPuzzleWalletClient()) {
      return "puzzle";
    }
    if (window.aleo) {
      return "aleo-compatible";
    }
    return "unknown";
  }

  /**
   * Disconnect wallet
   */
  public disconnect(): void {
    this.connected = false;
    this.account = null;
    
    try {
      const client = window.aleo?.puzzleWalletClient;
      if (client?.disconnect?.mutate) {
        client.disconnect.mutate({ method: "disconnect" }).catch(() => {});
      }
    } catch (e) {
      // Ignore disconnect errors
    }
  }

  /**
   * Get the current account address
   */
  public getAddress(): string | null {
    return this.account;
  }

  /**
   * Get program IDs
   */
  public static getProgramIds() {
    return {
      meeting: MEETING_PROGRAM_ID,
      eligibility: ELIGIBILITY_PROGRAM_ID,
      attendance: ATTENDANCE_PROGRAM_ID,
    };
  }
}
