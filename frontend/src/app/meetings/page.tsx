"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, Users, Shield, Loader2, Plus, Video, ExternalLink } from "lucide-react";
import { PuzzleWalletService } from "@/lib/puzzle";

interface Meeting {
  id: string;
  name: string;
  description: string;
  startTime: number;
  endTime: number;
  status: number;
  ruleType: string;
}

// Demo meetings for display
const demoMeetings: Meeting[] = [
  {
    id: "1",
    name: "DAO Governance Call",
    description: "Monthly governance discussion for token holders. Vote on proposals and discuss roadmap.",
    startTime: Math.floor(Date.now() / 1000) + 3600,
    endTime: Math.floor(Date.now() / 1000) + 7200,
    status: 0,
    ruleType: "token",
  },
  {
    id: "2",
    name: "NFT Holders Meetup",
    description: "Exclusive meeting for NFT collection holders. Discuss upcoming drops and community events.",
    startTime: Math.floor(Date.now() / 1000) + 86400,
    endTime: Math.floor(Date.now() / 1000) + 90000,
    status: 0,
    ruleType: "nft",
  },
];

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      const walletService = PuzzleWalletService.getInstance();
      const accounts = await walletService.getAccounts();
      
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        // Show demo meetings for now
        setMeetings(demoMeetings);
      }
    } catch (error) {
      console.error("Error loading meetings:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Upcoming";
      case 1:
        return "Ended";
      case 2:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return "bg-emerald-100 text-emerald-700";
      case 1:
        return "bg-slate-100 text-slate-700";
      case 2:
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getRuleIcon = (ruleType: string) => {
    switch (ruleType) {
      case "nft":
        return "🎨";
      case "token":
        return "🪙";
      case "dao":
        return "🏛️";
      default:
        return "🔒";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-sky-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading meetings...</p>
        </div>
      </div>
    );
  }

  if (!walletAddress) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Connect Your Wallet</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Connect your Puzzle Wallet to view and manage your private meetings.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg shadow-sky-500/25"
          >
            <Plus className="w-5 h-5" />
            Create Your First Meeting
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Meetings</h1>
          <p className="text-slate-600 mt-1">Manage your private meetings</p>
        </div>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg shadow-sky-500/25"
        >
          <Plus className="w-5 h-5" />
          Create Meeting
        </Link>
      </div>

      {meetings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-12 text-center">
          <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-sky-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">No Meetings Yet</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Create your first privacy-first meeting and invite participants with ZK verification.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg shadow-sky-500/25"
          >
            <Plus className="w-5 h-5" />
            Create Meeting
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl hover:border-sky-200 transition-all group"
            >
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-2xl">{getRuleIcon(meeting.ruleType)}</span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      meeting.status
                    )}`}
                  >
                    {getStatusText(meeting.status)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
                  {meeting.name}
                </h3>
                <p className="text-slate-600 text-sm line-clamp-2">
                  {meeting.description}
                </p>
              </div>

              {/* Card Details */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {formatDate(meeting.startTime)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="px-6 py-4 flex gap-2">
                {meeting.status === 0 && (
                  <Link
                    href={`/meeting/${meeting.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl text-sm font-medium hover:from-sky-600 hover:to-blue-700 transition-all"
                  >
                    <Video className="w-4 h-4" />
                    Join
                  </Link>
                )}
                <Link
                  href={`/meeting/${meeting.id}`}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Section */}
      <div className="mt-12 p-6 bg-sky-50 rounded-2xl border border-sky-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">Privacy Protected</h3>
            <p className="text-sm text-slate-600">
              All meetings use zero-knowledge proofs for eligibility verification. Your identity and holdings remain private while proving you meet the requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
