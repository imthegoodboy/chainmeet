# Build and Deploy Instructions

## ✅ Fixed Issues

1. **Fixed `program.json` format** - Changed from JSON object to TOML array format
2. **Fixed program names** - Updated all `main.leo` files to use correct program names

## 🚀 Next Steps

### Step 1: Build All Contracts

```bash
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

### Step 2: Deploy to Testnet

**Your Private Key:** `APrivateKey1zkpJxZnySB93VJjfRGVLiAhg9hwWUj5p31vScmwZXBqXgYX`

```bash
# Export private key (easier)
export PRIVATE_KEY="APrivateKey1zkpJxZnySB93VJjfRGVLiAhg9hwWUj5p31vScmwZXBqXgYX"

# Deploy Meeting Contract
cd meeting_chainmeet_7879
leo deploy --private-key $PRIVATE_KEY --network testnet --broadcast

# SAVE THE OUTPUT - You'll see the Program ID and Transaction ID

# Deploy Eligibility Contract
cd ../eligibility_chainmeet_8903
leo deploy --private-key $PRIVATE_KEY --network testnet --broadcast

# SAVE THE OUTPUT - You'll see the Program ID and Transaction ID

# Deploy Attendance Contract
cd ../attendance_chainmeet_1735
leo deploy --private-key $PRIVATE_KEY --network testnet --broadcast

# SAVE THE OUTPUT - You'll see the Program ID and Transaction ID
```

### Step 3: Save Program IDs

After deployment, you'll get output like:
```
Program ID: meeting_chainmeet_7879.aleo
Transaction ID: at1abc123...
```

**Save these Program IDs:**
- `meeting_chainmeet_7879.aleo`
- `eligibility_chainmeet_8903.aleo`
- `attendance_chainmeet_1735.aleo`

### Step 4: Update Frontend Environment

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_ALEO_NETWORK=testnet
NEXT_PUBLIC_ALEO_RPC_URL=https://api.explorer.aleo.org/v1

# Replace with your deployed Program IDs
NEXT_PUBLIC_MEETING_PROGRAM_ID=meeting_chainmeet_7879.aleo
NEXT_PUBLIC_ELIGIBILITY_PROGRAM_ID=eligibility_chainmeet_8903.aleo
NEXT_PUBLIC_ATTENDANCE_PROGRAM_ID=attendance_chainmeet_1735.aleo

# Add your Pinata keys (get from https://pinata.cloud)
NEXT_PUBLIC_PINATA_API_KEY=your_key_here
NEXT_PUBLIC_PINATA_SECRET_API_KEY=your_secret_here
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/

# Optional: LiveKit (for video)
NEXT_PUBLIC_LIVEKIT_URL=
NEXT_PUBLIC_LIVEKIT_API_KEY=
NEXT_PUBLIC_LIVEKIT_API_SECRET=

NODE_ENV=development
```

### Step 5: Run Frontend

```bash
cd ~/Desktop/ChainMeet/frontend
npm install
npm run dev
```

Visit `http://localhost:3000` and test!

## ⚠️ Important Notes

1. **Get Testnet Credits First**: Make sure your wallet has credits before deploying
   - Go to: https://faucet.aleo.org
   - Enter your wallet address
   - Request credits

2. **Program Names are Unique**: These names (`meeting_chainmeet_7879`, etc.) are already reserved by you once deployed

3. **Save Transaction IDs**: You can use these to track deployment on Aleo explorer

4. **Build Must Succeed First**: If `leo build` fails, deployment will fail too

## ✅ Success Checklist

- [ ] All three contracts build successfully
- [ ] All three contracts deploy successfully
- [ ] Saved all three Program IDs
- [ ] Updated frontend `.env.local` with Program IDs
- [ ] Frontend runs without errors
- [ ] Wallet connects successfully
- [ ] Can create a meeting
- [ ] Can join a meeting

Good luck! 🚀
