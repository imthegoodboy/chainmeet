# 🚀 Deploy ChainMeet Contracts - Complete Guide

## ✅ All Contracts Fixed!

Based on your example contract and Leo 3.4.0 requirements, all contracts are now:
- ✅ Have constructors (`@noupgrade async constructor() {}`)
- ✅ Use `Mapping::get_or_use` for safe mapping access
- ✅ Have proper counters for unique IDs
- ✅ Follow Leo 3.4.0 async patterns

---

## 🚀 Quick Deploy (Recommended)

### One Command to Deploy Everything:

```bash
cd /mnt/c/Users/parth/Desktop/ChainMeet/contracts
chmod +x deploy-all.sh
./deploy-all.sh
```

This script will:
1. Build all three contracts
2. Deploy them to testnet
3. Use `--yes` flag (no confirmations)
4. Include proper endpoint
5. Save Program IDs to a file

---

## 📋 Manual Deployment

### Step 1: Build

```bash
cd /mnt/c/Users/parth/Desktop/ChainMeet/contracts

cd meeting_chainmeet_7879 && leo build && cd ..
cd eligibility_chainmeet_8903 && leo build && cd ..
cd attendance_chainmeet_1735 && leo build && cd ..
```

### Step 2: Deploy

```bash
export PRIVATE_KEY="APrivateKey1zkpJxZnySB93VJjfRGVLiAhg9hwWUj5p31vScmwZXBqXgYX"

cd meeting_chainmeet_7879
leo deploy --private-key $PRIVATE_KEY --network testnet --endpoint https://api.explorer.provable.com/v1 --broadcast --yes

cd ../eligibility_chainmeet_8903
leo deploy --private-key $PRIVATE_KEY --network testnet --endpoint https://api.explorer.provable.com/v1 --broadcast --yes

cd ../attendance_chainmeet_1735
leo deploy --private-key $PRIVATE_KEY --network testnet --endpoint https://api.explorer.provable.com/v1 --broadcast --yes
```

### Step 3: Save Program IDs

From output, save:
- `meeting_chainmeet_7879.aleo`
- `eligibility_chainmeet_8903.aleo`
- `attendance_chainmeet_1735.aleo`

---

## 🔗 Connect to Frontend

### Update `frontend/.env.local`:

```env
NEXT_PUBLIC_MEETING_PROGRAM_ID=meeting_chainmeet_7879.aleo
NEXT_PUBLIC_ELIGIBILITY_PROGRAM_ID=eligibility_chainmeet_8903.aleo
NEXT_PUBLIC_ATTENDANCE_PROGRAM_ID=attendance_chainmeet_1735.aleo
```

### Run Frontend:

```bash
cd ~/Desktop/ChainMeet/frontend
npm run dev
```

---

## ✅ That's It!

Your contracts are fixed, deployment script is ready, and frontend is configured.

**Just run `./deploy-all.sh` and you're done!** 🎉
