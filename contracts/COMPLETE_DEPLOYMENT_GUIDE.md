# 🚀 Complete Deployment Guide - ChainMeet

**Status:** ✅ All contracts fixed and ready for deployment!

## ✅ What Was Fixed

Based on your example contract and Leo 3.4.0 best practices:

1. **Added Constructors** - All contracts now have `@noupgrade async constructor() {}`
2. **Fixed Mapping Access** - Changed `Mapping::get` to `Mapping::get_or_use` with default values
3. **Added Counters** - Proper meeting_id and proof_id counters using mappings
4. **Fixed Deployment Script** - Added build step and proper error handling

---

## 🚀 Quick Deploy (Recommended)

### Step 1: Make Script Executable

```bash
cd /mnt/c/Users/parth/Desktop/ChainMeet/contracts
chmod +x deploy-all.sh
```

### Step 2: Deploy All Contracts

```bash
./deploy-all.sh
```

This will:
- ✅ Build all three contracts
- ✅ Deploy them to testnet
- ✅ Use `--yes` flag (no confirmations)
- ✅ Include proper endpoint
- ✅ Save Program IDs to a file

---

## 📋 Manual Deployment (If Script Fails)

### Step 1: Build All Contracts

```bash
cd /mnt/c/Users/parth/Desktop/ChainMeet/contracts

# Build Meeting
cd meeting_chainmeet_7879
leo build

# Build Eligibility
cd ../eligibility_chainmeet_8903
leo build

# Build Attendance
cd ../attendance_chainmeet_1735
leo build
```

### Step 2: Deploy Each Contract

```bash
export PRIVATE_KEY="APrivateKey1zkpJxZnySB93VJjfRGVLiAhg9hwWUj5p31vScmwZXBqXgYX"
export ALEO_NETWORK="testnet"
export ALEO_ENDPOINT="https://api.explorer.provable.com/v1"

# Deploy Meeting
cd meeting_chainmeet_7879
leo deploy --private-key $PRIVATE_KEY --network testnet --endpoint https://api.explorer.provable.com/v1 --broadcast --yes

# Deploy Eligibility
cd ../eligibility_chainmeet_8903
leo deploy --private-key $PRIVATE_KEY --network testnet --endpoint https://api.explorer.provable.com/v1 --broadcast --yes

# Deploy Attendance
cd ../attendance_chainmeet_1735
leo deploy --private-key $PRIVATE_KEY --network testnet --endpoint https://api.explorer.provable.com/v1 --broadcast --yes
```

---

## 📝 After Deployment

### Step 1: Save Program IDs

From deployment output, save:
- `meeting_chainmeet_7879.aleo`
- `eligibility_chainmeet_8903.aleo`
- `attendance_chainmeet_1735.aleo`

### Step 2: Update Frontend `.env.local`

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_ALEO_NETWORK=testnet
NEXT_PUBLIC_ALEO_RPC_URL=https://api.explorer.aleo.org/v1

# Your deployed Program IDs
NEXT_PUBLIC_MEETING_PROGRAM_ID=meeting_chainmeet_7879.aleo
NEXT_PUBLIC_ELIGIBILITY_PROGRAM_ID=eligibility_chainmeet_8903.aleo
NEXT_PUBLIC_ATTENDANCE_PROGRAM_ID=attendance_chainmeet_1735.aleo

# Puzzle Wallet
NEXT_PUBLIC_PUZZLE_WALLET_URL=https://puzzle.online

# Pinata (get from https://pinata.cloud)
NEXT_PUBLIC_PINATA_API_KEY=your_key_here
NEXT_PUBLIC_PINATA_SECRET_API_KEY=your_secret_here
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/

NODE_ENV=development
```

### Step 3: Run Frontend

```bash
cd ~/Desktop/ChainMeet/frontend
npm install
npm run dev
```

Visit: http://localhost:3000

---

## ✅ Key Fixes Applied

### 1. Constructors Added
All contracts now have:
```leo
@noupgrade
async constructor() {}
```

### 2. Mapping Access Fixed
Changed from:
```leo
let value = Mapping::get(mapping, key);
```

To:
```leo
let value = Mapping::get_or_use(mapping, key, default_value);
```

### 3. Proper Counters
- Meeting contract: `meeting_counter` mapping for unique IDs
- Eligibility contract: `proof_counter` mapping for unique proof IDs

### 4. Deployment Script
- Builds before deploying
- Includes all required flags
- Auto-confirms with `--yes`
- Saves Program IDs automatically

---

## 🐛 Troubleshooting

### Build Fails
- Check `program.json` format (should be JSON object)
- Verify `src/main.leo` exists
- Ensure program name matches in both files

### Deploy Fails: "Insufficient credits"
- Get testnet credits: https://faucet.aleo.org
- Wait a few minutes for credits to arrive

### Deploy Fails: "Program name already exists"
- Program already deployed (this is OK!)
- Use existing Program ID in frontend

### Build Folder Empty
- Run `leo build` in the contract directory
- Check for build errors
- Verify `program.json` is correct

---

## 📊 Expected Output

After successful deployment, you should see:

```
✅ Successfully deployed program to testnet3
Program ID: meeting_chainmeet_7879.aleo
Transaction ID: at1xxxxx...
```

Save these for your frontend configuration!

---

## 🎯 Next Steps

1. ✅ Deploy contracts (use `./deploy-all.sh`)
2. ✅ Save Program IDs
3. ✅ Update `frontend/.env.local`
4. ✅ Get Pinata API keys
5. ✅ Run frontend (`npm run dev`)
6. ✅ Test all features

---

**Everything is now fixed and ready! 🚀**
