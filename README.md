# 🔐 ChainMeet - Privacy-First Web3 Meetings on Aleo

<div align="center">

![ChainMeet Logo](frontend/public/icon.svg)

**Join meetings without revealing your identity. Prove eligibility with zero-knowledge proofs.**

[![Aleo](https://img.shields.io/badge/Built%20on-Aleo-blue?style=for-the-badge)](https://aleo.org)
[![Leo](https://img.shields.io/badge/Smart%20Contracts-Leo-green?style=for-the-badge)](https://leo-lang.org)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=for-the-badge)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[Live Demo](https://chainmeet-beta.vercel.app/) • [Documentation](#how-it-works) • [Deployed Contracts](#-deployed-contracts)

</div>

---

live url - https://chainmeet-beta.vercel.app

## 🎯 What is ChainMeet?

ChainMeet is a **privacy-first meeting platform** built on the Aleo blockchain. It allows users to:

- **Join meetings anonymously** - Appear as "Anonymous #42" instead of revealing your wallet address
- **Prove eligibility with ZK proofs** - Demonstrate you own an NFT, hold tokens, or are a DAO member without revealing your actual holdings
- **Track attendance privately** - Your meeting history is recorded on-chain but remains private
- **Host exclusive meetings** - Create meetings that only eligible participants can join

### Why ChainMeet?

Traditional meeting platforms expose your identity. Web3 meetings often require connecting your wallet publicly, revealing your address and holdings. ChainMeet solves this by using **zero-knowledge proofs** to verify eligibility without exposing sensitive information.

| Traditional Meetings | ChainMeet |
|---------------------|-----------|
| Identity exposed | Anonymous participation |
| Wallet address visible | ZK proof verification |
| Holdings revealed | Private eligibility check |
| No on-chain record | Private attendance tracking |

---

## ✨ Features

### 🔒 Privacy Features
- **Zero-Knowledge Proofs** - Prove eligibility without revealing your wallet, identity, or holdings
- **Anonymous Identities** - Join meetings as "Anonymous #42" with complete privacy
- **Private Attendance** - Track participation with ZK aggregation

### 🎥 Meeting Features
- **HD Video & Audio** - High-quality video conferencing powered by LiveKit
- **Encrypted Chat** - Secure messaging during meetings
- **Screen Sharing** - Share your screen with participants
- **Meeting Recordings** - Optional encrypted recordings

### ⛓️ Blockchain Features
- **On-Chain Verification** - All proofs verified on Aleo blockchain
- **Smart Contract Rules** - Flexible eligibility rules (NFT, Token, DAO, Custom)
- **Decentralized Storage** - Meeting metadata stored on IPFS via Pinata

---

## 🚀 Deployed Contracts

ChainMeet is **live on Aleo Testnet** with the following deployed contracts:

| Contract | Program ID | Purpose |
|----------|------------|---------|
| **Meeting** | `meeting_chainmeet_7879.aleo` | Create and manage meetings |
| **Eligibility** | `eligibility_chainmeet_8903.aleo` | Verify participant eligibility with ZK proofs |
| **Attendance** | `attendance_chainmeet_1735.aleo` | Track private attendance records |

### Contract Functions

#### Meeting Contract (`meeting_chainmeet_7879.aleo`)
- `create_meeting` - Create a new meeting with eligibility rules
- `update_meeting` - Update meeting details (organizer only)
- `cancel_meeting` - Cancel a meeting

#### Eligibility Contract (`eligibility_chainmeet_8903.aleo`)
- `verify_nft_ownership` - Prove NFT ownership without revealing which NFT
- `verify_token_balance` - Prove minimum token balance privately
- `verify_dao_membership` - Prove DAO membership anonymously
- `verify_custom_rule` - Custom eligibility verification

#### Attendance Contract (`attendance_chainmeet_1735.aleo`)
- `record_attendance` - Record meeting attendance privately
- `get_attendance_proof` - Generate proof of attendance
- `aggregate_attendance` - Aggregate attendance for reputation

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Blockchain** | [Aleo](https://aleo.org) - Privacy-focused L1 |
| **Smart Contracts** | [Leo](https://leo-lang.org) - Aleo's programming language |
| **Frontend** | [Next.js 14](https://nextjs.org) + TypeScript |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) |
| **Wallet** | [Puzzle Wallet](https://puzzle.online) |
| **Video** | [LiveKit](https://livekit.io) |
| **Storage** | [Pinata](https://pinata.cloud) / IPFS |

---

## 📦 Project Structure

```
chainmeet/
├── contracts/                    # Leo smart contracts
│   ├── meeting_chainmeet_7879/   # Meeting management contract
│   ├── eligibility_chainmeet_8903/ # Eligibility verification
│   └── attendance_chainmeet_1735/  # Attendance tracking
├── frontend/                     # Next.js frontend
│   ├── src/
│   │   ├── app/                  # Next.js app router pages
│   │   ├── components/           # React components
│   │   └── lib/                  # Utilities & SDK integration
│   └── public/                   # Static assets
├── scripts/                      # Deployment scripts
├── MISTAKES.md                   # Development lessons learned
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18+
- [Puzzle Wallet](https://puzzle.online) browser extension
- Aleo testnet credits (get from [faucet](https://faucet.aleo.org))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chainmeet.git
   cd chainmeet
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   # Aleo Network
   NEXT_PUBLIC_ALEO_NETWORK=testnet
   NEXT_PUBLIC_ALEO_RPC_URL=https://api.explorer.provable.com/v1
   
   # Deployed Contract IDs
   NEXT_PUBLIC_MEETING_PROGRAM_ID=meeting_chainmeet_7879.aleo
   NEXT_PUBLIC_ELIGIBILITY_PROGRAM_ID=eligibility_chainmeet_8903.aleo
   NEXT_PUBLIC_ATTENDANCE_PROGRAM_ID=attendance_chainmeet_1735.aleo
   
   # Optional: Pinata for IPFS storage
   NEXT_PUBLIC_PINATA_API_KEY=your_api_key
   NEXT_PUBLIC_PINATA_SECRET_KEY=your_secret_key
   
   # Optional: LiveKit for video
   NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-server
   LIVEKIT_API_KEY=your_api_key
   LIVEKIT_API_SECRET=your_api_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 How It Works

### 1. Connect Your Wallet
Connect your Puzzle Wallet. Your address is used for verification but never displayed publicly.

### 2. Create or Join a Meeting
- **Organizers** create meetings with eligibility rules (NFT holder, token balance, DAO member)
- **Participants** browse available meetings

### 3. Generate ZK Proof
When joining a meeting, generate a zero-knowledge proof that you meet the eligibility requirements without revealing:
- Your wallet address
- Your exact token balance
- Which specific NFT you own
- Your DAO voting power

### 4. Join Anonymously
Once verified, join the meeting as "Anonymous #42" with full video, audio, and chat capabilities.

### 5. Private Attendance Tracking
Your attendance is recorded on-chain with ZK proofs. You can later prove you attended meetings without revealing which ones.

---

## 🔧 Development

### Building Contracts

```bash
cd contracts/meeting_chainmeet_7879
leo build

cd ../eligibility_chainmeet_8903
leo build

cd ../attendance_chainmeet_1735
leo build
```

### Deploying Contracts

```bash
leo deploy --private-key $PRIVATE_KEY \
  --network testnet \
  --endpoint https://api.explorer.provable.com/v1 \
  --broadcast \
  --yes
```

### Running Tests

```bash
cd frontend
npm run lint
npm run build
```

---

## 📚 Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [MISTAKES.md](./MISTAKES.md) - Common mistakes and lessons learned
- [contracts/README_DEPLOY.md](./contracts/README_DEPLOY.md) - Contract deployment details

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Aleo](https://aleo.org) - For building the privacy-focused blockchain
- [Puzzle Wallet](https://puzzle.online) - For the excellent wallet SDK
- [LiveKit](https://livekit.io) - For video infrastructure
- [Pinata](https://pinata.cloud) - For IPFS storage

---

<div align="center">

**Built with ❤️ for privacy**

[⬆ Back to top](#-chainmeet---privacy-first-web3-meetings-on-aleo)

</div>
