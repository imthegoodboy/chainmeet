#!/bin/bash

# ChainMeet - Environment Setup Script
# This script helps set up the development environment

set -e

echo "🔧 ChainMeet Environment Setup"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js not found. Please install Node.js v18+${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${YELLOW}⚠️  Node.js version should be 18 or higher${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) found${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}⚠️  npm not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm -v) found${NC}"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd "$(dirname "$0")/../frontend"
npm install

echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo ""
    echo "📝 Creating .env.local file..."
    cat > .env.local << 'EOF'
# Aleo Network Configuration
NEXT_PUBLIC_ALEO_NETWORK=testnet
NEXT_PUBLIC_ALEO_RPC_URL=https://api.explorer.aleo.org/v1

# Smart Contract Program IDs (update after deployment)
NEXT_PUBLIC_MEETING_PROGRAM_ID=
NEXT_PUBLIC_ELIGIBILITY_PROGRAM_ID=
NEXT_PUBLIC_ATTENDANCE_PROGRAM_ID=

# Puzzle Wallet Configuration
NEXT_PUBLIC_PUZZLE_WALLET_URL=https://puzzle.online

# Pinata/IPFS Configuration (get from https://pinata.cloud)
NEXT_PUBLIC_PINATA_API_KEY=
NEXT_PUBLIC_PINATA_SECRET_API_KEY=
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/

# LiveKit Configuration (optional)
NEXT_PUBLIC_LIVEKIT_URL=
NEXT_PUBLIC_LIVEKIT_API_KEY=
NEXT_PUBLIC_LIVEKIT_API_SECRET=

# Environment
NODE_ENV=development
EOF
    echo -e "${GREEN}✅ .env.local created${NC}"
    echo -e "${YELLOW}⚠️  Please update .env.local with your API keys${NC}"
else
    echo -e "${GREEN}✅ .env.local already exists${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Update frontend/.env.local with your API keys"
echo "2. Deploy contracts using scripts/deploy-contracts.sh"
echo "3. Run 'npm run dev' in frontend directory"
