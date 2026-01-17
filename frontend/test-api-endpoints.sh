#!/bin/bash

# ChainMeet - Test API Endpoints Script
# This script tests all API endpoints and configurations

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🧪 ChainMeet - API Endpoints Test"
echo "=================================="
echo ""

# Load environment variables
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
  echo -e "${GREEN}✅ Loaded .env.local${NC}"
else
  echo -e "${YELLOW}⚠️  .env.local not found${NC}"
  echo "Creating .env.local template..."
fi

echo ""

# Test 1: Aleo RPC Endpoint
echo -e "${BLUE}Test 1: Aleo RPC Endpoint${NC}"
echo "----------------------------------------"
if [ -z "$NEXT_PUBLIC_ALEO_RPC_URL" ]; then
  echo -e "${RED}❌ NEXT_PUBLIC_ALEO_RPC_URL not set${NC}"
else
  echo -e "${GREEN}✅ RPC URL: $NEXT_PUBLIC_ALEO_RPC_URL${NC}"
  # Test endpoint connectivity
  if curl -s --head "$NEXT_PUBLIC_ALEO_RPC_URL" | head -n 1 | grep -q "HTTP"; then
    echo -e "${GREEN}✅ Endpoint is reachable${NC}"
  else
    echo -e "${YELLOW}⚠️  Could not verify endpoint connectivity${NC}"
  fi
fi
echo ""

# Test 2: Program IDs
echo -e "${BLUE}Test 2: Program IDs${NC}"
echo "----------------------------------------"
PROGRAMS=(
  "NEXT_PUBLIC_MEETING_PROGRAM_ID"
  "NEXT_PUBLIC_ELIGIBILITY_PROGRAM_ID"
  "NEXT_PUBLIC_ATTENDANCE_PROGRAM_ID"
)

for PROGRAM_VAR in "${PROGRAMS[@]}"; do
  PROGRAM_ID=$(eval echo \$$PROGRAM_VAR)
  if [ -z "$PROGRAM_ID" ]; then
    echo -e "${RED}❌ $PROGRAM_VAR not set${NC}"
  else
    echo -e "${GREEN}✅ $PROGRAM_VAR: $PROGRAM_ID${NC}"
  fi
done
echo ""

# Test 3: Pinata Configuration
echo -e "${BLUE}Test 3: Pinata Configuration${NC}"
echo "----------------------------------------"
if [ -z "$NEXT_PUBLIC_PINATA_API_KEY" ]; then
  echo -e "${YELLOW}⚠️  NEXT_PUBLIC_PINATA_API_KEY not set (optional)${NC}"
else
  echo -e "${GREEN}✅ Pinata API Key: ${NEXT_PUBLIC_PINATA_API_KEY:0:8}...${NC}"
fi

if [ -z "$NEXT_PUBLIC_PINATA_SECRET_API_KEY" ]; then
  echo -e "${YELLOW}⚠️  NEXT_PUBLIC_PINATA_SECRET_API_KEY not set (optional)${NC}"
else
  echo -e "${GREEN}✅ Pinata Secret: ${NEXT_PUBLIC_PINATA_SECRET_API_KEY:0:8}...${NC}"
fi

if [ -z "$NEXT_PUBLIC_PINATA_GATEWAY" ]; then
  echo -e "${YELLOW}⚠️  NEXT_PUBLIC_PINATA_GATEWAY not set${NC}"
else
  echo -e "${GREEN}✅ Pinata Gateway: $NEXT_PUBLIC_PINATA_GATEWAY${NC}"
fi
echo ""

# Test 4: Puzzle Wallet
echo -e "${BLUE}Test 4: Puzzle Wallet Configuration${NC}"
echo "----------------------------------------"
if [ -z "$NEXT_PUBLIC_PUZZLE_WALLET_URL" ]; then
  echo -e "${YELLOW}⚠️  NEXT_PUBLIC_PUZZLE_WALLET_URL not set${NC}"
else
  echo -e "${GREEN}✅ Puzzle Wallet URL: $NEXT_PUBLIC_PUZZLE_WALLET_URL${NC}"
fi
echo ""

# Test 5: LiveKit (Optional)
echo -e "${BLUE}Test 5: LiveKit Configuration (Optional)${NC}"
echo "----------------------------------------"
if [ -z "$NEXT_PUBLIC_LIVEKIT_URL" ]; then
  echo -e "${YELLOW}⚠️  LiveKit not configured (optional for video)${NC}"
else
  echo -e "${GREEN}✅ LiveKit URL: $NEXT_PUBLIC_LIVEKIT_URL${NC}"
fi
echo ""

# Test 6: Network Configuration
echo -e "${BLUE}Test 6: Network Configuration${NC}"
echo "----------------------------------------"
if [ -z "$NEXT_PUBLIC_ALEO_NETWORK" ]; then
  echo -e "${YELLOW}⚠️  NEXT_PUBLIC_ALEO_NETWORK not set${NC}"
else
  echo -e "${GREEN}✅ Network: $NEXT_PUBLIC_ALEO_NETWORK${NC}"
fi
echo ""

# Test 7: Test Program Mapping Queries
echo -e "${BLUE}Test 7: Test Program Mapping Queries${NC}"
echo "----------------------------------------"

if [ ! -z "$NEXT_PUBLIC_MEETING_PROGRAM_ID" ] && [ ! -z "$NEXT_PUBLIC_ALEO_RPC_URL" ]; then
  PROGRAM_NAME=$(echo $NEXT_PUBLIC_MEETING_PROGRAM_ID | sed 's/\.aleo$//')
  TEST_URL="${NEXT_PUBLIC_ALEO_RPC_URL}/program/${NEXT_PUBLIC_MEETING_PROGRAM_ID}"
  
  echo "Testing: $TEST_URL"
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$TEST_URL" || echo "000")
  
  if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "404" ]; then
    echo -e "${GREEN}✅ Endpoint is responding (HTTP $HTTP_CODE)${NC}"
  else
    echo -e "${YELLOW}⚠️  Endpoint returned HTTP $HTTP_CODE${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  Cannot test - Program ID or RPC URL not set${NC}"
fi
echo ""

# Summary
echo "=========================================="
echo -e "${BLUE}📊 Summary${NC}"
echo "=========================================="
echo ""
echo "✅ Required for deployment:"
echo "  - Aleo RPC URL"
echo "  - Program IDs (all three)"
echo "  - Network configuration"
echo ""
echo "⚠️  Optional (for full functionality):"
echo "  - Pinata API keys (for image/metadata storage)"
echo "  - LiveKit configuration (for video)"
echo ""
echo "📝 To complete setup:"
echo "1. Update frontend/.env.local with missing values"
echo "2. Get Pinata API keys from https://pinata.cloud"
echo "3. Restart frontend: npm run dev"
echo ""
