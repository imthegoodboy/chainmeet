# ✅ Fixed - Build and Deploy Instructions

## ✅ What Was Fixed

**Problem:** Leo 3.4.0 expects `program.json` to contain just the program name as a string (e.g., `"program_name.aleo"`), not a JSON object or TOML format.

**Solution:** Updated all `program.json` files to contain just the program name string.

---

## 🚀 Now You Can Build!

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

### Step 2: Deploy to Testnet

**Your Private Key:** `APrivateKey1zkpJxZnySB93VJjfRGVLiAhg9hwWUj5p31vScmwZXBqXgYX`

```bash
# Set your private key as environment variable
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

### Step 3: Save Program IDs

After each deployment, save these three Program IDs:
- `meeting_chainmeet_7879.aleo`
- `eligibility_chainmeet_8903.aleo`
- `attendance_chainmeet_1735.aleo`

---

### Step 4: Update Frontend Environment

Edit `frontend/.env.local` and add:

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

---

### Step 5: Get Testnet Credits

Before deploying, make sure you have testnet credits:

1. Go to https://faucet.aleo.org
2. Get your wallet address (derive from private key or use Puzzle Wallet)
3. Request testnet credits
4. Wait a few minutes for credits to arrive

**To get your address from private key:**
```bash
leo account address --private-key APrivateKey1zkpJxZnySB93VJjfRGVLiAhg9hwWUj5p31vScmwZXBqXgYX
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

## ✅ Success Checklist

- [x] Fixed `program.json` format (now just program name string)
- [ ] All three contracts build successfully
- [ ] All three contracts deploy successfully  
- [ ] Saved all three Program IDs
- [ ] Updated frontend `.env.local` with Program IDs
- [ ] Got testnet credits
- [ ] Frontend runs successfully
- [ ] Wallet connects
- [ ] Can create meetings
- [ ] Can join meetings

---

## 🐛 If You Still Get Errors

### Error: "Insufficient credits"
→ Get more testnet credits from faucet

### Error: "Program name already exists"
→ The program is already deployed (you can skip deploying it again)

### Error: Build still fails
→ Make sure:
- You're in the contract directory when running `leo build`
- File is at `src/main.leo` (not `main.leo` in root)
- Program name in `main.leo` matches `program.json`

---

Good luck! 🚀 Try building now - it should work!
