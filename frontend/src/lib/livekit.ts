// LiveKit Integration

import { Room, RoomEvent, RemoteParticipant, LocalParticipant } from "livekit-client";

export interface LiveKitConfig {
  url: string;
  token: string;
}

export class LiveKitService {
  private room: Room | null = null;
  private config: LiveKitConfig;

  constructor(config: LiveKitConfig) {
    this.config = config;
  }

  public async connect(roomName: string, participantName: string): Promise<Room> {
    if (this.room && this.room.state === "connected") {
      return this.room;
    }

    this.room = new Room();
    
    // Set up event listeners
    this.room.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
      console.log("Participant connected:", participant.identity);
    });

    this.room.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
      console.log("Participant disconnected:", participant.identity);
    });

    try {
      await this.room.connect(this.config.url, this.config.token);
      return this.room;
    } catch (error) {
      console.error("Failed to connect to LiveKit room:", error);
      throw new Error("Failed to connect to video room");
    }
  }

  public async disconnect(): Promise<void> {
    if (this.room) {
      await this.room.disconnect();
      this.room = null;
    }
  }

  public getRoom(): Room | null {
    return this.room;
  }

  public async enableCamera(enabled: boolean): Promise<void> {
    if (!this.room) return;
    
    const localParticipant = this.room.localParticipant;
    if (enabled) {
      await localParticipant.setCameraEnabled(true);
    } else {
      await localParticipant.setCameraEnabled(false);
    }
  }

  public async enableMicrophone(enabled: boolean): Promise<void> {
    if (!this.room) return;
    
    const localParticipant = this.room.localParticipant;
    if (enabled) {
      await localParticipant.setMicrophoneEnabled(true);
    } else {
      await localParticipant.setMicrophoneEnabled(false);
    }
  }

  public async enableScreenShare(enabled: boolean): Promise<void> {
    if (!this.room) return;
    
    const localParticipant = this.room.localParticipant;
    if (enabled) {
      await localParticipant.setScreenShareEnabled(true);
    } else {
      await localParticipant.setScreenShareEnabled(false);
    }
  }
}

// Helper function to generate LiveKit token (should be done server-side in production)
export async function generateLiveKitToken(
  roomName: string,
  participantName: string,
  apiKey: string,
  apiSecret: string
): Promise<string> {
  // In production, this should be done server-side
  // For now, return a placeholder
  // You'll need to implement token generation using LiveKit's token generation library
  return "token-placeholder";
}
