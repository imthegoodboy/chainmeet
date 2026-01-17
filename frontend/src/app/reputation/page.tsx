"use client";

import { useEffect, useState } from "react";
import { PuzzleWalletService } from "@/lib/puzzle";
import { aleoService } from "@/lib/aleo";
import { ShieldCheck, RefreshCw, Trophy, Star, Zap, Crown, Gem, Target, Loader2 } from "lucide-react";

type ReputationState = {
  address: string | null;
  meetingCount: number | null;
  tier: string;
  loading: boolean;
  nextTier: string | null;
  progress: number;
};

const tiers = [
  { name: "Newcomer", min: 0, icon: Target, color: "slate" },
  { name: "Bronze", min: 1, icon: Star, color: "amber" },
  { name: "Silver", min: 5, icon: Zap, color: "slate" },
  { name: "Gold", min: 10, icon: Trophy, color: "yellow" },
  { name: "Diamond", min: 20, icon: Gem, color: "sky" },
  { name: "Legend", min: 50, icon: Crown, color: "violet" },
];

const getTierInfo = (count: number) => {
  let currentTier = tiers[0];
  let nextTier = tiers[1];
  
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (count >= tiers[i].min) {
      currentTier = tiers[i];
      nextTier = tiers[i + 1] || null;
      break;
    }
  }
  
  const progress = nextTier 
    ? ((count - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;
  
  return { currentTier, nextTier, progress: Math.min(progress, 100) };
};

export default function ReputationPage() {
  const [state, setState] = useState<ReputationState>({
    address: null,
    meetingCount: null,
    tier: "Newcomer",
    loading: true,
    nextTier: "Bronze",
    progress: 0,
  });

  const loadReputation = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const walletService = PuzzleWalletService.getInstance();
      const accounts = await walletService.getAccounts();
      if (accounts.length === 0) {
        setState({
          address: null,
          meetingCount: null,
          tier: "Newcomer",
          loading: false,
          nextTier: "Bronze",
          progress: 0,
        });
        return;
      }

      const address = accounts[0];
      const count = await aleoService.getUserMeetingCount(address);
      const { currentTier, nextTier, progress } = getTierInfo(count);
      
      setState({
        address,
        meetingCount: count,
        tier: currentTier.name,
        loading: false,
        nextTier: nextTier?.name || null,
        progress,
      });
    } catch (error) {
      console.error("Failed to load reputation:", error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    loadReputation();
  }, []);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const currentTierInfo = tiers.find(t => t.name === state.tier) || tiers[0];
  const TierIcon = currentTierInfo.icon;

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-sky-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading reputation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Reputation</h1>
            <p className="text-slate-600">
              On-chain attendance reputation powered by ZK proofs
            </p>
          </div>
        </div>
        <button
          onClick={loadReputation}
          disabled={state.loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${state.loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {!state.address ? (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Connect Your Wallet</h2>
          <p className="text-slate-600 max-w-md mx-auto">
            Connect your Puzzle Wallet to view your on-chain reputation and attendance tier.
          </p>
        </div>
      ) : (
        <>
          {/* Main Reputation Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl p-8 mb-6 text-white overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Connected Wallet</p>
                  <p className="font-mono text-lg">{formatAddress(state.address)}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-sm mb-1">Network</p>
                  <p className="font-semibold">Aleo Testnet</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-${currentTierInfo.color}-400 to-${currentTierInfo.color}-600 flex items-center justify-center shadow-lg`}>
                  <TierIcon className="w-12 h-12 text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Current Tier</p>
                  <p className="text-4xl font-bold">{state.tier}</p>
                  <p className="text-sky-400 mt-1">
                    {state.meetingCount} meeting{state.meetingCount !== 1 ? "s" : ""} attended
                  </p>
                </div>
              </div>

              {/* Progress to next tier */}
              {state.nextTier && (
                <div className="mt-8">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Progress to {state.nextTier}</span>
                    <span className="text-white font-medium">{Math.round(state.progress)}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-sky-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${state.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-sky-600" />
                </div>
                <span className="text-sm text-slate-500">Meetings Attended</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {state.meetingCount ?? 0}
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-violet-600" />
                </div>
                <span className="text-sm text-slate-500">Reputation Tier</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{state.tier}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-sm text-slate-500">Privacy Level</span>
              </div>
              <p className="text-3xl font-bold text-emerald-600">Max</p>
            </div>
          </div>

          {/* Tier Progression */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Tier Progression</h2>
            <div className="space-y-4">
              {tiers.map((tier, index) => {
                const Icon = tier.icon;
                const isCurrentTier = tier.name === state.tier;
                const isEarned = (state.meetingCount || 0) >= tier.min;
                
                return (
                  <div 
                    key={tier.name}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                      isCurrentTier 
                        ? "bg-sky-50 border-2 border-sky-200" 
                        : isEarned 
                          ? "bg-slate-50" 
                          : "opacity-50"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isEarned ? `bg-${tier.color}-100` : "bg-slate-200"
                    }`}>
                      <Icon className={`w-6 h-6 ${isEarned ? `text-${tier.color}-600` : "text-slate-400"}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{tier.name}</span>
                        {isCurrentTier && (
                          <span className="px-2 py-0.5 bg-sky-500 text-white text-xs rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">
                        {tier.min === 0 ? "Starting tier" : `${tier.min}+ meetings`}
                      </p>
                    </div>
                    {isEarned && (
                      <div className="text-emerald-500">✓</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
