import Link from "next/link";
import Image from "next/image";
import { Shield, Users, Lock, Zap, Video, CheckCircle, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-20 sm:py-28">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 border border-sky-200 rounded-full text-sky-700 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Built on Aleo Blockchain
            </div>

            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Image 
                src="/icon.svg" 
                alt="ChainMeet" 
                width={80} 
                height={80}
                className="drop-shadow-lg"
              />
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                Chain
              </span>
              <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                Meet
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-600 mb-4 font-medium">
              Privacy-First Web3 Meetings
            </p>
            
            <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join meetings anonymously with zero-knowledge proofs. 
              Prove you&apos;re eligible without revealing your identity, wallet, or holdings.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/create"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30"
              >
                Create Meeting
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/join"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-semibold hover:border-sky-300 hover:text-sky-600 transition-all shadow-lg"
              >
                Join Meeting
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">100%</div>
                <div className="text-sm text-slate-500">Private</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">ZK</div>
                <div className="text-sm text-slate-500">Verified</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">On-Chain</div>
                <div className="text-sm text-slate-500">Secured</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Why ChainMeet?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Traditional meetings expose your identity. ChainMeet keeps you anonymous while proving you belong.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Zero-Knowledge Proofs",
                description: "Prove eligibility without revealing your wallet, identity, or sensitive information.",
                color: "sky",
              },
              {
                icon: Users,
                title: "Anonymous Meetings",
                description: "Join as \"Anonymous #42\" with complete privacy. Your identity stays hidden.",
                color: "blue",
              },
              {
                icon: Lock,
                title: "Private Attendance",
                description: "Track attendance with ZK aggregation. Prove participation without revealing which meetings.",
                color: "indigo",
              },
              {
                icon: Zap,
                title: "On-Chain Verification",
                description: "Everything verified on Aleo blockchain. No dummy data, fully decentralized.",
                color: "violet",
              },
              {
                icon: Video,
                title: "HD Video & Audio",
                description: "High-quality video conferencing with encrypted chat and screen sharing.",
                color: "purple",
              },
              {
                icon: CheckCircle,
                title: "Production Ready",
                description: "Fully functional, tested, and ready for deployment. Built for real-world use.",
                color: "fuchsia",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-100/50 transition-all"
              >
                <div className={`w-14 h-14 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Four simple steps to join private meetings with zero-knowledge proofs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                step: "1",
                title: "Connect Your Wallet",
                description: "Connect your Puzzle Wallet. Your address is used for verification but never displayed publicly.",
              },
              {
                step: "2",
                title: "Generate ZK Proof",
                description: "Prove you meet the requirements (NFT holder, token balance, DAO member) without revealing details.",
              },
              {
                step: "3",
                title: "Join Anonymously",
                description: "Enter the meeting as \"Anonymous #42\" with full video, audio, and encrypted chat.",
              },
              {
                step: "4",
                title: "Track Attendance",
                description: "Your attendance is recorded on-chain. Prove participation without revealing which meetings.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex gap-5 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deployed Contracts */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Live on Aleo Testnet
            </h2>
            <p className="text-lg text-slate-600">
              Our smart contracts are deployed and ready to use
            </p>
          </div>

          <div className="space-y-4">
            {[
              { name: "Meeting Contract", id: "meeting_chainmeet_7879.aleo", desc: "Create and manage meetings" },
              { name: "Eligibility Contract", id: "eligibility_chainmeet_8903.aleo", desc: "Verify participant eligibility" },
              { name: "Attendance Contract", id: "attendance_chainmeet_1735.aleo", desc: "Track private attendance" },
            ].map((contract, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-200"
              >
                <div className="mb-2 sm:mb-0">
                  <h3 className="font-semibold text-slate-900">{contract.name}</h3>
                  <p className="text-sm text-slate-500">{contract.desc}</p>
                </div>
                <code className="text-sm bg-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-mono">
                  {contract.id}
                </code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sky-500 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Join Private Meetings?
          </h2>
          <p className="text-xl text-sky-100 mb-10 max-w-2xl mx-auto">
            Connect your wallet and start hosting or joining anonymous meetings today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-sky-600 rounded-xl font-semibold hover:bg-sky-50 transition-colors shadow-lg"
            >
              Create Your First Meeting
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
