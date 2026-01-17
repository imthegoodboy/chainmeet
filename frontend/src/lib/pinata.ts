// Pinata/IPFS Integration

import axios from "axios";

export interface PinataConfig {
  apiKey: string;
  secretApiKey: string;
  gateway: string;
}

export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export class PinataService {
  private config: PinataConfig;
  private baseURL = "https://api.pinata.cloud";

  constructor(config: PinataConfig) {
    this.config = config;
  }

  public async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const metadata = JSON.stringify({
      name: file.name,
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    try {
      const response = await axios.post<PinataResponse>(
        `${this.baseURL}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: this.config.apiKey,
            pinata_secret_api_key: this.config.secretApiKey,
          },
        }
      );

      return response.data.IpfsHash;
    } catch (error) {
      console.error("Error uploading file to Pinata:", error);
      throw new Error("Failed to upload file to IPFS");
    }
  }

  public async uploadJSON(data: any): Promise<string> {
    try {
      const response = await axios.post<PinataResponse>(
        `${this.baseURL}/pinning/pinJSONToIPFS`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: this.config.apiKey,
            pinata_secret_api_key: this.config.secretApiKey,
          },
        }
      );

      return response.data.IpfsHash;
    } catch (error) {
      console.error("Error uploading JSON to Pinata:", error);
      throw new Error("Failed to upload JSON to IPFS");
    }
  }

  public getGatewayURL(cid: string): string {
    return `${this.config.gateway}${cid}`;
  }

  public async uploadMeetingMetadata(metadata: {
    name: string;
    description: string;
    organizer: string;
    ruleType: string;
    startTime: number;
    endTime: number;
    imageCid?: string;
  }): Promise<string> {
    const metadataJSON = {
      name: metadata.name,
      description: metadata.description,
      organizer: metadata.organizer,
      ruleType: metadata.ruleType,
      startTime: metadata.startTime,
      endTime: metadata.endTime,
      image: metadata.imageCid
        ? this.getGatewayURL(metadata.imageCid)
        : undefined,
      createdAt: new Date().toISOString(),
    };

    return await this.uploadJSON(metadataJSON);
  }
}

// Initialize Pinata service with environment variables
export const pinataService = new PinataService({
  apiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY || "",
  secretApiKey: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY || "",
  gateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs/",
});
