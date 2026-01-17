"use client";

import { useState, useEffect, useCallback } from "react";
import { Wallet, LogOut, AlertCircle, Loader2 } from "lucide-react";
import { PuzzleWalletService } from "@/lib/puzzle";

interface WalletState {
  connected: boolean;
  address: string | null;
  signature: string | null;
  error: string | null;
}

export default function WalletConnect() {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    signature: null,
    error: null,
  });
  const [loading, setLoading] = useState(false);
  const [walletAvailable, setWalletAvailable] = useState<boolean | null>(null);

  // Check wallet availability on mount
  useEffect(() => {
    const checkWallet = async () => {
      // Small delay to allow extension to inject
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const walletService = PuzzleWalletService.getInstance();
      const available = await walletService.checkAvailability();
      setWalletAvailable(available);

      if (available) {
        // Check if already connected
        checkWalletConnection();
      }
    };

    checkWallet();
  }, []);

  const checkWalletConnection = useCallback(async () => {
    try {
      const walletService = PuzzleWalletService.getInstance();

      // Get accounts with error handling
      const accounts = await walletService.getAccounts();
      if (accounts && accounts.length > 0 && accounts[0]) {
        const storedSignature =
          typeof window !== "undefined"
            ? localStorage.getItem("chainmeet_wallet_signature")
            : null;
        setWallet({
          connected: true,
          address: accounts[0],
          signature: storedSignature,
          error: null,
        });
      }
    } catch (error) {
      // Silently fail on check - wallet might not be connected yet
      console.debug("Wallet not connected:", error);
    }
  }, []);

  const connectWallet = async () => {
    setLoading(true);
    setWallet((prev) => ({ ...prev, error: null }));

    try {
      const walletService = PuzzleWalletService.getInstance();

      // Check if wallet is available
      const available = await walletService.checkAvailability();
      if (!available) {
        setWallet((prev) => ({
          ...prev,
          error: "Puzzle Wallet not found. Please install the extension from puzzle.online",
        }));
        window.open("https://puzzle.online", "_blank");
        return;
      }

      // Connect wallet
      const accounts = await walletService.connect();

      if (!accounts || accounts.length === 0 || !accounts[0]) {
        throw new Error("No accounts returned from wallet");
      }

      // Update state with connected account
      setWallet({
        connected: true,
        address: accounts[0],
        signature: null,
        error: null,
      });

      // Try to get signature (optional - don't fail if it doesn't work)
      try {
        const signature = await walletService.requestSignature(
          "Sign this message to verify your wallet for ChainMeet."
        );
        if (typeof window !== "undefined" && signature) {
          localStorage.setItem("chainmeet_wallet_signature", signature);
          setWallet((prev) => ({ ...prev, signature }));
        }
      } catch (signatureError: any) {
        console.warn("Wallet signature optional - continuing:", signatureError.message);
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      const errorMessage = error.message || "Failed to connect wallet. Please try again.";
      setWallet((prev) => ({ ...prev, error: errorMessage }));
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    const walletService = PuzzleWalletService.getInstance();
    walletService.disconnect();
    
    if (typeof window !== "undefined") {
      localStorage.removeItem("chainmeet_wallet_signature");
    }
    setWallet({
      connected: false,
      address: null,
      signature: null,
      error: null,
    });
  };

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Show install prompt if wallet not available
  if (walletAvailable === false) {
    return (
      <div className="flex items-center gap-2">
        <a
          href="https://puzzle.online"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-md text-sm font-medium hover:bg-amber-600 transition-colors"
        >
          <Wallet className="w-4 h-4" />
          Install Puzzle Wallet
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {wallet.error && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-md text-xs max-w-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="line-clamp-2">{wallet.error}</span>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        {wallet.connected ? (
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-sky-50 text-sky-700 rounded-md text-sm font-medium">
              {formatAddress(wallet.address || "")}
            </div>
            {wallet.signature ? (
              <span className="px-2 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-md">
                Verified
              </span>
            ) : (
              <span className="px-2 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-md">
                Connected
              </span>
            )}
            <button
              onClick={disconnectWallet}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="Disconnect"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            disabled={loading || walletAvailable === null}
            className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-md text-sm font-medium hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : walletAvailable === null ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
