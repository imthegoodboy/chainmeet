"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Shield, Upload, Loader2, AlertCircle, CheckCircle, Info } from "lucide-react";
import { aleoService } from "@/lib/aleo";
import { pinataService } from "@/lib/pinata";
import { PuzzleWalletService } from "@/lib/puzzle";

export default function CreateMeetingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ruleType: "nft",
    ruleContractHash: "",
    minBalance: "",
    startDate: "",
    startTime: "",
    duration: "60",
    image: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Check wallet connection
      const walletService = PuzzleWalletService.getInstance();
      const accounts = await walletService.getAccounts();
      
      if (accounts.length === 0) {
        // Try to connect
        try {
          await walletService.connect();
          const newAccounts = await walletService.getAccounts();
          if (newAccounts.length === 0) {
            throw new Error("Please connect your wallet first");
          }
        } catch (connectError: any) {
          throw new Error("Please connect your wallet first. " + connectError.message);
        }
      }

      // Upload image to Pinata if provided
      let imageCid = "";
      if (formData.image) {
        try {
          imageCid = await pinataService.uploadFile(formData.image);
        } catch (uploadError) {
          console.warn("Image upload failed, continuing without image:", uploadError);
        }
      }

      // Calculate start and end times
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const startTime = Math.floor(startDateTime.getTime() / 1000);
      const endTime = startTime + parseInt(formData.duration) * 60;

      // Generate rule hash
      const ruleHash = generateRuleHash(formData.ruleType, formData.ruleContractHash, formData.minBalance);

      // Upload meeting metadata to Pinata
      let metadataCid = "";
      try {
        const updatedAccounts = await walletService.getAccounts();
        metadataCid = await pinataService.uploadMeetingMetadata({
          name: formData.name,
          description: formData.description,
          organizer: updatedAccounts[0],
          ruleType: formData.ruleType,
          startTime,
          endTime,
          imageCid: imageCid || undefined,
        });
      } catch (metadataError) {
        console.warn("Metadata upload failed, using placeholder:", metadataError);
        metadataCid = "placeholder_" + Date.now();
      }

      // Create meeting on-chain
      const eventId = await aleoService.createMeeting({
        name: formData.name,
        description: formData.description,
        ruleHash,
        startTime,
        endTime,
        metadataCid,
      });

      setSuccess(`Meeting created successfully! Event ID: ${eventId}`);
      
      // Redirect after short delay
      setTimeout(() => {
        router.push("/meetings");
      }, 2000);
    } catch (error: any) {
      console.error("Error creating meeting:", error);
      setError(error.message || "Failed to create meeting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateRuleHash = (ruleType: string, contractHash: string, minBalance: string): string => {
    // Simplified hash generation
    return `${ruleType}-${contractHash || "any"}-${minBalance || "0"}`;
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-6">
          <h1 className="text-2xl font-bold text-white">Create Meeting</h1>
          <p className="text-sky-100 mt-1">Set up a private meeting with ZK eligibility rules</p>
        </div>

        <div className="p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Success!</p>
                <p className="text-sm mt-1">{success}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Meeting Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Meeting Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                placeholder="e.g., DAO Governance Call"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe what this meeting is about..."
              />
            </div>

            {/* Eligibility Rule */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                <Shield className="w-4 h-4 text-sky-500" />
                Eligibility Rule <span className="text-red-500">*</span>
              </label>
              <select
                name="ruleType"
                value={formData.ruleType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white transition-all"
              >
                <option value="nft">NFT Holder - Must own specific NFT</option>
                <option value="token">Token Balance - Must hold minimum tokens</option>
                <option value="dao">DAO Member - Must be a DAO member</option>
                <option value="custom">Custom Rule - Custom verification</option>
              </select>

              {/* Contract Hash */}
              <div className="mt-4">
                <label className="block text-sm text-slate-600 mb-2">
                  Contract/Program ID (optional)
                </label>
                <input
                  type="text"
                  name="ruleContractHash"
                  value={formData.ruleContractHash}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  placeholder="e.g., token_program.aleo"
                />
              </div>

              {/* Min Balance (for token rule) */}
              {formData.ruleType === "token" && (
                <div className="mt-4">
                  <label className="block text-sm text-slate-600 mb-2">
                    Minimum Balance
                  </label>
                  <input
                    type="number"
                    name="minBalance"
                    value={formData.minBalance}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    placeholder="0"
                    min="0"
                  />
                </div>
              )}

              <div className="mt-4 flex items-start gap-2 text-sm text-slate-500">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>Participants will need to generate a ZK proof to verify they meet this requirement without revealing their actual holdings.</p>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <Calendar className="w-4 h-4 text-sky-500" />
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  min={today}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <Clock className="w-4 h-4 text-sky-500" />
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Duration <span className="text-red-500">*</span>
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white transition-all"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
                <option value="180">3 hours</option>
                <option value="240">4 hours</option>
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Upload className="w-4 h-4 text-sky-500" />
                Meeting Image (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-sky-300 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {formData.image ? (
                    <div className="flex items-center justify-center gap-2 text-sky-600">
                      <CheckCircle className="w-5 h-5" />
                      <span>{formData.image.name}</span>
                    </div>
                  ) : (
                    <div className="text-slate-500">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                      <p>Click to upload an image</p>
                      <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Meeting...
                </>
              ) : (
                "Create Meeting"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
