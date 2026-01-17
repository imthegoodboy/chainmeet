# 🚀 Deploy Contracts - Quick Instructions

## ✅ Fixed Issues

1. **Endpoint Configuration** - Added `--endpoint` flag to all deploy commands
2. **Auto-Confirm** - Added `--yes` flag to skip confirmations
3. **Shell Script** - Created automated deployment script

---

## Option 1: Deploy All Contracts (Recommended)

**Run this single command:**

```bash
cd /mnt/c/Users/parth/Desktop/ChainMeet/contracts
chmod +x deploy-all.sh
./deploy-all.sh
```

This will:
- ✅ Deploy all three contracts automatically
- ✅ Use `--yes` flag (no manual confirmations)
- ✅ Include proper endpoint configuration
- ✅ Save Program IDs to a file
- ✅ Show deployment summary

**The script will:**
1. Deploy `meeting_chainmeet_7879`
2. Deploy `eligibility_chainmeet_8903`
3. Deploy `attendance_chainmeet_1735`
4. Save all Program IDs to a file

---

## Option 2: Deploy Single Contract

If you want to deploy one contract at a time:

```bash
cd /mnt/c/Users/parth/Desktop/ChainMeet/contracts
chmod +x deploy-single.sh

# Deploy Meeting
./deploy-single.sh meeting_chainmeet_7879

# Deploy Eligibility
./deploy-single.sh eligibility_chainmeet_8903

# Deploy Attendance
./deploy-single.sh attendance_chainmeet_1735
```

---

## Option 3: Manual Deploy (If scripts don't work)

Run these commands manually:

```bash
cd /mnt/c/Users/parth/Desktop/ChainMeet/contracts

export PRIVATE_KEY="APrivateKey1zkpJxZnySB93VJjfRGVLiAhg9hwWUj5p31vScmwZXBqXgYX"
export ALEO_NETWORK="testnet"
export ALEO_ENDPOINT="https://api.explorer.provable.com/v1"

# Deploy Meeting
cd meeting_chainmeet_7879
leo deploy --private-key $PRIVATE_KEY --network testnet --endpoint https://api.explorer.provable.com/v1 --broadcast --yes
cd ..

# Deploy Eligibility
cd eligibility_chainmeet_8903
leo deploy --private-key $PRIVATE_KEY --network testnet --endpoint https://api.explorer.provable.com/v1 --broadcast --yes
cd ..

# Deploy Attendance
cd attendance_chainmeet_1735
leo deploy --private-key $PRIVATE_KEY --network testnet --endpoint https://api.explorer.provable.com/v1 --broadcast --yes
cd ..
```

---

## After Deployment

1. **Save Program IDs** from the output
2. **Update `frontend/.env.local`** with Program IDs
3. **Run frontend:** `cd frontend && npm run dev`

---

## Configuration Details

The scripts use:
- **Private Key:** `APrivateKey1zkpJxZnySB93VJjfRGVLiAhg9hwWUj5p31vScmwZXBqXgYX`
- **Network:** `testnet`
- **Endpoint:** `https://api.explorer.provable.com/v1`
- **Flags:** `--broadcast --yes` (auto-confirm)

All environment variables are set automatically in the scripts.

---

## Troubleshooting

### Error: "Please provide the --endpoint"
**Solution:** The scripts now include `--endpoint` flag automatically.

### Error: "Insufficient credits"
**Solution:** Get testnet credits from https://faucet.aleo.org

### Error: "Program name already exists"
**Solution:** The program is already deployed. Use the existing Program ID.

---

## Quick Reference

**Deploy all:** `./deploy-all.sh`
**Deploy one:** `./deploy-single.sh <directory>`
**Check status:** View `deployed_testnet_*.txt` file created by script
