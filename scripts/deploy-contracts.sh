#!/bin/bash

# ChainMeet - Contract Deployment Script
# This script helps deploy all contracts to Aleo network

set -e

echo "🚀 ChainMeet Contract Deployment Script"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Leo is installed
if ! command -v leo &> /dev/null; then
    echo -e "${RED}❌ Leo CLI not found. Please install Leo first.${NC}"
    echo "Visit: https://github.com/AleoHQ/leo/releases"
    exit 1
fi

echo -e "${GREEN}✅ Leo CLI found${NC}"
echo ""

# Get network (testnet or mainnet)
read -p "Enter network (testnet/mainnet) [testnet]: " NETWORK
NETWORK=${NETWORK:-testnet}

if [ "$NETWORK" != "testnet" ] && [ "$NETWORK" != "mainnet" ]; then
    echo -e "${RED}❌ Invalid network. Must be 'testnet' or 'mainnet'${NC}"
    exit 1
fi

echo -e "${YELLOW}📡 Deploying to: $NETWORK${NC}"
echo ""

# Get private key
read -p "Enter your private key: " PRIVATE_KEY
if [ -z "$PRIVATE_KEY" ]; then
    echo -e "${RED}❌ Private key is required${NC}"
    exit 1
fi

# Navigate to contracts directory
cd "$(dirname "$0")/../contracts"

echo "📦 Building contracts..."
echo ""

# Build contracts
echo "Building meeting.leo..."
leo build meeting.leo || {
    echo -e "${RED}❌ Failed to build meeting.leo${NC}"
    exit 1
}

echo "Building eligibility.leo..."
leo build eligibility.leo || {
    echo -e "${RED}❌ Failed to build eligibility.leo${NC}"
    exit 1
}

echo "Building attendance.leo..."
leo build attendance.leo || {
    echo -e "${RED}❌ Failed to build attendance.leo${NC}"
    exit 1
}

echo -e "${GREEN}✅ All contracts built successfully${NC}"
echo ""

# Deploy contracts
echo "🚀 Deploying contracts..."
echo ""

# Deploy meeting contract
echo "Deploying meeting.aleo..."
MEETING_OUTPUT=$(leo deploy meeting.aleo --private-key "$PRIVATE_KEY" --network "$NETWORK" --broadcast 2>&1)
MEETING_PROGRAM_ID=$(echo "$MEETING_OUTPUT" | grep -oP 'Program ID: \K[^\s]+' || echo "")

if [ -z "$MEETING_PROGRAM_ID" ]; then
    echo -e "${RED}❌ Failed to deploy meeting.aleo${NC}"
    echo "$MEETING_OUTPUT"
    exit 1
fi

echo -e "${GREEN}✅ Meeting contract deployed: $MEETING_PROGRAM_ID${NC}"
echo ""

# Deploy eligibility contract
echo "Deploying eligibility.aleo..."
ELIGIBILITY_OUTPUT=$(leo deploy eligibility.aleo --private-key "$PRIVATE_KEY" --network "$NETWORK" --broadcast 2>&1)
ELIGIBILITY_PROGRAM_ID=$(echo "$ELIGIBILITY_OUTPUT" | grep -oP 'Program ID: \K[^\s]+' || echo "")

if [ -z "$ELIGIBILITY_PROGRAM_ID" ]; then
    echo -e "${RED}❌ Failed to deploy eligibility.aleo${NC}"
    echo "$ELIGIBILITY_OUTPUT"
    exit 1
fi

echo -e "${GREEN}✅ Eligibility contract deployed: $ELIGIBILITY_PROGRAM_ID${NC}"
echo ""

# Deploy attendance contract
echo "Deploying attendance.aleo..."
ATTENDANCE_OUTPUT=$(leo deploy attendance.aleo --private-key "$PRIVATE_KEY" --network "$NETWORK" --broadcast 2>&1)
ATTENDANCE_PROGRAM_ID=$(echo "$ATTENDANCE_OUTPUT" | grep -oP 'Program ID: \K[^\s]+' || echo "")

if [ -z "$ATTENDANCE_PROGRAM_ID" ]; then
    echo -e "${RED}❌ Failed to deploy attendance.aleo${NC}"
    echo "$ATTENDANCE_OUTPUT"
    exit 1
fi

echo -e "${GREEN}✅ Attendance contract deployed: $ATTENDANCE_PROGRAM_ID${NC}"
echo ""

# Save deployment info
DEPLOYMENT_FILE="deployed_${NETWORK}.json"
cat > "$DEPLOYMENT_FILE" << EOF
{
  "network": "$NETWORK",
  "deployed_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "contracts": {
    "meeting": "$MEETING_PROGRAM_ID",
    "eligibility": "$ELIGIBILITY_PROGRAM_ID",
    "attendance": "$ATTENDANCE_PROGRAM_ID"
  }
}
EOF

echo -e "${GREEN}✅ Deployment information saved to: $DEPLOYMENT_FILE${NC}"
echo ""
echo "📝 Add these to your frontend .env file:"
echo ""
echo "NEXT_PUBLIC_MEETING_PROGRAM_ID=$MEETING_PROGRAM_ID"
echo "NEXT_PUBLIC_ELIGIBILITY_PROGRAM_ID=$ELIGIBILITY_PROGRAM_ID"
echo "NEXT_PUBLIC_ATTENDANCE_PROGRAM_ID=$ATTENDANCE_PROGRAM_ID"
echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
