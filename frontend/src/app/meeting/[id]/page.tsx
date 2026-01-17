"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Video, VideoOff, Mic, MicOff, Monitor, X, Send } from "lucide-react";
import { LiveKitService } from "@/lib/livekit";
import { aleoService } from "@/lib/aleo";
import { PuzzleWalletService } from "@/lib/puzzle";

export default function MeetingRoomPage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = params.id as string;

  const [livekitService, setLivekitService] = useState<LiveKitService | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [screenShareEnabled, setScreenShareEnabled] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: string; time: Date }>>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [anonymousId, setAnonymousId] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeMeeting();
    return () => {
      if (livekitService) {
        livekitService.disconnect();
      }
    };
  }, [meetingId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initializeMeeting = async () => {
    try {
      // Generate anonymous ID
      const id = `Anonymous #${Math.floor(Math.random() * 1000)}`;
      setAnonymousId(id);

      // Record attendance on-chain
      const walletService = PuzzleWalletService.getInstance();
      const accounts = await walletService.getAccounts();
      if (accounts.length > 0) {
        try {
          await aleoService.recordAttendance(meetingId);
        } catch (error) {
          console.error("Failed to record attendance:", error);
        }
      }

      // Initialize LiveKit (in production, get token from server)
      const service = new LiveKitService({
        url: process.env.NEXT_PUBLIC_LIVEKIT_URL || "",
        token: "token-placeholder", // Should be generated server-side
      });

      // For demo purposes, we'll skip actual LiveKit connection
      // In production, connect to LiveKit room here
      setLivekitService(service);
      setLoading(false);
    } catch (error) {
      console.error("Error initializing meeting:", error);
      setLoading(false);
    }
  };

  const toggleCamera = async () => {
    if (livekitService) {
      await livekitService.enableCamera(!cameraEnabled);
      setCameraEnabled(!cameraEnabled);
    }
  };

  const toggleMic = async () => {
    if (livekitService) {
      await livekitService.enableMicrophone(!micEnabled);
      setMicEnabled(!micEnabled);
    }
  };

  const toggleScreenShare = async () => {
    if (livekitService) {
      await livekitService.enableScreenShare(!screenShareEnabled);
      setScreenShareEnabled(!screenShareEnabled);
    }
  };

  const sendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: chatMessage,
        sender: anonymousId,
        time: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setChatMessage("");
    }
  };

  const leaveMeeting = () => {
    if (livekitService) {
      livekitService.disconnect();
    }
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Joining meeting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Meeting Room</h1>
          <p className="text-sm text-gray-400">You are: {anonymousId}</p>
        </div>
        <button
          onClick={leaveMeeting}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Leave
        </button>
      </div>

      <div className="flex-1 flex">
        {/* Video Grid */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Local Video */}
            <div className="bg-gray-800 rounded-lg overflow-hidden relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {!cameraEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="text-center">
                    <VideoOff className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400">{anonymousId}</p>
                  </div>
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
                {anonymousId} (You)
              </div>
            </div>

            {/* Remote Participants */}
            {participants.map((participant) => (
              <div key={participant} className="bg-gray-800 rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="text-center">
                    <VideoOff className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400">{participant}</p>
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
                  {participant}
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={toggleCamera}
              className={`p-4 rounded-full ${
                cameraEnabled ? "bg-gray-700" : "bg-red-500"
              } text-white hover:opacity-80 transition-opacity`}
            >
              {cameraEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>
            <button
              onClick={toggleMic}
              className={`p-4 rounded-full ${
                micEnabled ? "bg-gray-700" : "bg-red-500"
              } text-white hover:opacity-80 transition-opacity`}
            >
              {micEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>
            <button
              onClick={toggleScreenShare}
              className={`p-4 rounded-full ${
                screenShareEnabled ? "bg-sky-500" : "bg-gray-700"
              } text-white hover:opacity-80 transition-opacity`}
            >
              <Monitor className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Chat</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-1">
                <p className="text-xs font-medium text-gray-600">{message.sender}</p>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">
                  {message.text}
                </p>
                <p className="text-xs text-gray-400">
                  {message.time.toLocaleTimeString()}
                </p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
