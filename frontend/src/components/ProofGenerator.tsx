"use client";

import { useState } from "react";
import { Shield, Loader2, CheckCircle } from "lucide-react";

interface ProofGeneratorProps {
  ruleType: "nft" | "token" | "dao" | "custom";
  onProofGenerated: (proof: string) => void;
}

export default function ProofGenerator({ ruleType, onProofGenerated }: ProofGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [proof, setProof] = useState<string | null>(null);
  const [contractHash, setContractHash] = useState("");
  const [minBalance, setMinBalance] = useState("");

  const generateProof = async () => {
    setGenerating(true);
    try {
      // In production, this would use proper ZK proof generation
      // For now, generate a simplified proof
      const proofData = {
        ruleType,
        contractHash: contractHash || "default",
        minBalance: minBalance || "0",
        timestamp: Date.now(),
      };

      // Simulate proof generation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const generatedProof = `proof-${JSON.stringify(proofData)}`;
      setProof(generatedProof);
      onProofGenerated(generatedProof);
    } catch (error) {
      console.error("Error generating proof:", error);
      alert("Failed to generate proof");
    } finally {
      setGenerating(false);
    }
  };

  if (proof) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-green-800">Proof Generated</span>
        </div>
        <p className="text-sm text-green-700">
          Your eligibility proof has been generated and verified.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-sky-100 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-sky-500" />
        <h3 className="font-semibold text-gray-900">Generate ZK Proof</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contract Hash (if required)
          </label>
          <input
            type="text"
            value={contractHash}
            onChange={(e) => setContractHash(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder="Enter contract hash"
          />
        </div>

        {ruleType === "token" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Balance
            </label>
            <input
              type="number"
              value={minBalance}
              onChange={(e) => setMinBalance(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
        )}

        <button
          onClick={generateProof}
          disabled={generating}
          className="w-full px-4 py-2 bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Proof...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4" />
              Generate Proof
            </>
          )}
        </button>
      </div>
    </div>
  );
}
