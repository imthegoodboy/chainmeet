# ✅ FINAL FIX - Build and Deploy Guide

## ✅ What Was Fixed

**The Issue:** Leo 3.4.0 expects `program.json` to be a **JSON object with a Manifest structure**, not a string or TOML.

**The Fix:** Updated all three `program.json` files to use the proper JSON object format:

```json
{
  "program": "program_name.aleo",
  "version": "1.0.0",
  "description": "...",
  "license": "MIT",
  "dependencies": {}
}
```

---

## 🚀 Now Build and Deploy!

### Step 1: Build All Contracts

Run these commands in WSL:

```bash
cd /mnt/c/Users/parth/Desktop/ChainMeet/contracts

# Build Meeting Contract
cd meeting_chainmeet_7879
leo build

# Build Eligibility Contract
cd ../eligibility_chainmeet_8903
leo build

# Build Attendance Contract
cd ../attendance_chainmeet_1735
leo build
```

**All builds should now succeed!** ✅

---

### Step 2: Get Testnet Credits (If Needed)

Before deploying, make sure your wallet has testnet credits:

1. Get your wallet address:
```bash
leo account address --private-key APrivateKey1zkpJxZnySB93VJjfRGVLiAhg9hwWUj5p31vScmwZXBqXgYX
```

2. Go to https://faucet.aleo.org
3. Request testnet credits using your address
4. Wait a few minutes for credits to arrive

---

### Step 3: Deploy to Testnet

**Your Private Key:** `APrivateKey1zkpJxZnySB93VJjfRGVLiAhg9hwWUj5p31vScmwZXBqXgYX`

```bash
# Set private key as environment variable
export PRIVATE_KEY="APrivateKey1zkpJxZnySB93VJjfRGVLiAhg9hwWUj5p31vScmwZXBqXgYX"

# Deploy Meeting Contract
cd meeting_chainmeet_7879
leo deploy --private-key $PRIVATE_KEY --network testnet --broadcast

# ⚠️ SAVE THE OUTPUT! You'll see:
# Program ID: meeting_chainmeet_7879.aleo
# Transaction ID: at1xxxxx...

# Deploy Eligibility Contract
cd ../eligibility_chainmeet_8903
leo deploy --private-key $PRIVATE_KEY --network testnet --broadcast

# ⚠️ SAVE THE OUTPUT!

# Deploy Attendance Contract
cd ../attendance_chainmeet_1735
leo deploy --private-key $PRIVATE_KEY --network testnet --broadcast

# ⚠️ SAVE THE OUTPUT!
```

---

### Step 4: Save Program IDs

After each deployment, you'll see output like:

```
✅ Deploying 'meeting_chainmeet_7879.aleo' to 'testnet3'
...
Program ID: meeting_chainmeet_7879.aleo
Transaction ID: at1abc123def456...
```

**Save these three Program IDs:**
- `meeting_chainmeet_7879.aleo`
- `eligibility_chainmeet_8903.aleo`
- `attendance_chainmeet_1735.aleo`

---

### Step 5: Update Frontend Environment

Edit `frontend/.env.local` and add/update:

```env
NEXT_PUBLIC_ALEO_NETWORK=testnet
NEXT_PUBLIC_ALEO_RPC_URL=https://api.explorer.aleo.org/v1

# Your deployed Program IDs (replace with actual IDs from deployment)
NEXT_PUBLIC_MEETING_PROGRAM_ID=meeting_chainmeet_7879.aleo
NEXT_PUBLIC_ELIGIBILITY_PROGRAM_ID=eligibility_chainmeet_8903.aleo
NEXT_PUBLIC_ATTENDANCE_PROGRAM_ID=attendance_chainmeet_1735.aleo

# Puzzle Wallet
NEXT_PUBLIC_PUZZLE_WALLET_URL=https://puzzle.online

# Pinata (get from https://pinata.cloud - sign up for free)
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_API_KEY=your_pinata_secret_key
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/

# LiveKit (optional - for video)
NEXT_PUBLIC_LIVEKIT_URL=
NEXT_PUBLIC_LIVEKIT_API_KEY=
NEXT_PUBLIC_LIVEKIT_API_SECRET=

NODE_ENV=development
```

---

### Step 6: Run Frontend

```bash
cd ~/Desktop/ChainMeet/frontend
npm install
npm run dev
```

Visit `http://localhost:3000` and test your app! 🎉

---

## ✅ Complete Checklist

- [x] Fixed `program.json` format (JSON object with Manifest structure)
- [ ] All three contracts build successfully (`leo build`)
- [ ] Got testnet credits for your wallet
- [ ] All three contracts deploy successfully (`leo deploy`)
- [ ] Saved all three Program IDs from deployment output
- [ ] Updated `frontend/.env.local` with Program IDs
- [ ] Frontend runs successfully (`npm run dev`)
- [ ] Wallet connects in the frontend
- [ ] Can create a meeting
- [ ] Can join a meeting

---

## 🐛 Troubleshooting

### Build Still Fails?
- ✅ Make sure `program.json` is a JSON object (not string, not TOML)
- ✅ Make sure `src/main.leo` exists
- ✅ Make sure program name in `main.leo` matches `program.json`'s `program` field

### Deploy Fails with "Insufficient credits"?
→ Get more testnet credits from https://faucet.aleo.org

### Deploy Fails with "Program name already exists"?
→ The program is already deployed (you can skip deploying it again, just use the existing Program ID)

### Build Says "Cannot find src/main.leo"?
→ Make sure the `.leo` file is at `src/main.leo` (not `main.leo` in root directory)

---

## 📝 Summary

The correct `program.json` format for Leo 3.4.0 is:

```json
{
  "program": "your_program_name.aleo",
  "version": "1.0.0",
  "description": "Your description",
  "license": "MIT",
  "dependencies": {}
}
```

**Try building now - it should work!** 🚀
