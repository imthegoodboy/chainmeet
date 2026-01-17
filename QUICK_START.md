# ⚡ Quick Start Guide - Deploy & Connect

**Everything is ready! All contracts compile successfully.** ✅

## 🚀 Quick Commands

### 1. Deploy Contracts (Run in WSL)

```bash
cd /mnt/c/Users/parth/Desktop/ChainMeet/contracts

export PRIVATE_KEY="APrivateKey1zkpJxZnySB93VJjfRGVLiAhg9hwWUj5p31vScmwZXBqXgYX"

# Deploy Meeting
cd meeting_chainmeet_7879
leo deploy --private-key $PRIVATE_KEY --network testnet --broadcast

# Deploy Eligibility  
cd ../eligibility_chainmeet_8903
leo deploy --private-key $PRIVATE_KEY --network testnet --broadcast

# Deploy Attendance
cd ../attendance_chainmeet_1735
leo deploy --private-key $PRIVATE_KEY --network testnet --broadcast
```

**⚠️ Save the Program IDs from output!**

### 2. Update Frontend Config

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_ALEO_NETWORK=testnet
NEXT_PUBLIC_ALEO_RPC_URL=https://api.explorer.aleo.org/v1

# Replace with your deployed Program IDs
NEXT_PUBLIC_MEETING_PROGRAM_ID=meeting_chainmeet_7879.aleo
NEXT_PUBLIC_ELIGIBILITY_PROGRAM_ID=eligibility_chainmeet_8903.aleo
NEXT_PUBLIC_ATTENDANCE_PROGRAM_ID=attendance_chainmeet_1735.aleo

# Get from https://pinata.cloud
NEXT_PUBLIC_PINATA_API_KEY=your_key
NEXT_PUBLIC_PINATA_SECRET_API_KEY=your_secret
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

### 3. Run Frontend

```bash
cd ~/Desktop/ChainMeet/frontend
npm install
npm run dev
```

Visit: http://localhost:3000

---

## 📋 Before Deploying

1. **Get testnet credits:** https://faucet.aleo.org
2. **Get Pinata API keys:** https://pinata.cloud (free signup)

---

## ✅ That's It!

See `DEPLOY_AND_CONNECT.md` for detailed instructions.
