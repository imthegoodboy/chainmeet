"use client";

import { useState, useEffect } from "react";
import { Shield, Users, Award, TrendingUp, Loader2, Copy, Check, ExternalLink } from "lucide-react";
import { aleoService } from "@/lib/aleo";
import { PuzzleWalletService } from "@/lib/puzzle";

export default function ProfilePage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [meetingCount, setMeetingCount] = useState(0);
  const [badges, setBadges] = useState<Array<{ name: string; threshold: number; earned: boolean; icon: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const walletService = PuzzleWalletService.getInstance();
      const accounts = await walletService.getAccounts();
      
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        
        // Fetch meeting count
        const count = await aleoService.getUserMeetingCount(accounts[0]);
        setMeetingCount(count);

        // Generate badges based on meeting count
        const badgeList = [
          { name: "First Meeting", threshold: 1, earned: count >= 1, icon: "🎯" },
          { name: "Regular Attendee", threshold: 5, earned: count >= 5, icon: "⭐" },
          { name: "Dedicated Member", threshold: 10, earned: count >= 10, icon: "🏆" },
          { name: "Community Leader", threshold: 25, earned: count >= 25, icon: "👑" },
          { name: "Meeting Master", threshold: 50, earned: count >= 50, icon: "💎" },
        ];
        setBadges(badgeList);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 12)}...${address.slice(-8)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-sky-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading profile...</p>
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
          <p className="text-slate-600 max-w-md mx-auto">
            Connect your Puzzle Wallet to view your profile and attendance statistics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
        <p className="text-slate-600 mt-1">Your private attendance records and achievements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Wallet Info */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-sky-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Wallet Address</h2>
          </div>
          <div className="flex items-center gap-3">
            <code className="flex-1 text-sm bg-slate-50 px-4 py-3 rounded-xl text-slate-700 font-mono overflow-hidden text-ellipsis">
              {formatAddress(walletAddress)}
            </code>
            <button
              onClick={copyAddress}
              className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              title="Copy address"
            >
              {copied ? (
                <Check className="w-5 h-5 text-emerald-600" />
              ) : (
                <Copy className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            🔒 Your address is never shown publicly in meetings
          </p>
        </div>

        {/* Meeting Count */}
        <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold">Meetings</h2>
          </div>
          <p className="text-5xl font-bold">{meetingCount}</p>
          <p className="text-sm text-sky-100 mt-2">Total attended</p>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <Award className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Attendance Badges</h2>
            <p className="text-sm text-slate-500">
              {badges.filter((b) => b.earned).length} of {badges.length} earned
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border-2 transition-all ${
                badge.earned
                  ? "bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200"
                  : "bg-slate-50 border-slate-200 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <h3 className="font-semibold text-slate-900">{badge.name}</h3>
                  <p className="text-xs text-slate-500">
                    {badge.threshold} meeting{badge.threshold > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              {badge.earned && (
                <div className="flex items-center gap-1 text-xs text-sky-600 font-medium mt-2">
                  <Check className="w-3.5 h-3.5" />
                  Earned
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-violet-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Statistics</h2>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-slate-100">
            <span className="text-slate-600">Meetings Attended</span>
            <span className="font-semibold text-slate-900">{meetingCount}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-slate-100">
            <span className="text-slate-600">Badges Earned</span>
            <span className="font-semibold text-slate-900">
              {badges.filter((b) => b.earned).length} / {badges.length}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-slate-100">
            <span className="text-slate-600">Privacy Level</span>
            <span className="font-semibold text-emerald-600">Maximum 🔒</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-slate-600">Network</span>
            <span className="font-semibold text-slate-900">Aleo Testnet</span>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="p-6 bg-sky-50 rounded-2xl border border-sky-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">Privacy Protected</h3>
            <p className="text-sm text-slate-600">
              Your attendance records are stored privately on-chain using zero-knowledge proofs. 
              You can prove you attended meetings without revealing which specific meetings you joined. 
              Your wallet address is never exposed in meeting rooms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
