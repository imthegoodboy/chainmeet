#!/bin/bash

# ChainMeet - Deploy All Contracts to Testnet
# This script deploys all three contracts automatically with --yes flag

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 ChainMeet - Deploy All Contracts to Testnet${NC}"
echo "=================================================="
echo ""

# Configuration
PRIVATE_KEY="APrivateKey1zkpJxZnySB93VJjfRGVLiAhg9hwWUj5p31vScmwZXBqXgYX"
NETWORK="testnet"
ENDPOINT="https://api.explorer.provable.com/v1"
BROADCAST="--broadcast"
YES_FLAG="--yes"

# Export environment variables
export PRIVATE_KEY=$PRIVATE_KEY
export ALEO_NETWORK=$NETWORK
export ALEO_ENDPOINT=$ENDPOINT

echo -e "${YELLOW}📡 Network: ${NETWORK}${NC}"
echo -e "${YELLOW}📡 Endpoint: ${ENDPOINT}${NC}"
echo ""

# Navigate to contracts directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Store deployment results
declare -A PROGRAM_IDS
declare -A TX_IDS

# Function to deploy a contract
deploy_contract() {
    local CONTRACT_DIR=$1
    local CONTRACT_NAME=$2
    
    echo -e "${GREEN}📦 Deploying ${CONTRACT_NAME}...${NC}"
    echo "----------------------------------------"
    
    cd "$CONTRACT_DIR"
    
    # Build first
    echo "Building ${CONTRACT_NAME}..."
    leo build || {
        echo -e "${RED}❌ Failed to build ${CONTRACT_NAME}${NC}"
        exit 1
    }
    
    # Deploy with all required flags
    echo "Deploying ${CONTRACT_NAME}..."
    DEPLOY_OUTPUT=$(leo deploy \
        --private-key "$PRIVATE_KEY" \
        --network "$NETWORK" \
        --endpoint "$ENDPOINT" \
        $BROADCAST \
        $YES_FLAG 2>&1) || {
        echo -e "${RED}❌ Failed to deploy ${CONTRACT_NAME}${NC}"
        echo "$DEPLOY_OUTPUT"
        exit 1
    }
    
    # Extract Program ID from output
    PROGRAM_ID=$(echo "$DEPLOY_OUTPUT" | grep -oP "Program ID:\s*\K[^\s]+" || echo "")
    TX_ID=$(echo "$DEPLOY_OUTPUT" | grep -oP "Transaction ID:\s*\K[^\s]+" || echo "")
    
    if [ -z "$PROGRAM_ID" ]; then
        # Try alternative pattern
        PROGRAM_ID=$(echo "$DEPLOY_OUTPUT" | grep -oP "'\K[^']+\.aleo" | head -1 || echo "")
    fi
    
    if [ ! -z "$PROGRAM_ID" ]; then
        PROGRAM_IDS["$CONTRACT_NAME"]=$PROGRAM_ID
        echo -e "${GREEN}✅ Successfully deployed ${CONTRACT_NAME}${NC}"
        echo -e "${GREEN}   Program ID: ${PROGRAM_ID}${NC}"
        if [ ! -z "$TX_ID" ]; then
            TX_IDS["$CONTRACT_NAME"]=$TX_ID
            echo -e "${GREEN}   Transaction ID: ${TX_ID}${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Deployed but couldn't extract Program ID${NC}"
        echo "$DEPLOY_OUTPUT" | tail -10
    fi
    
    echo ""
    cd ..
}

# Deploy Meeting Contract
deploy_contract "meeting_chainmeet_7879" "Meeting"

# Deploy Eligibility Contract
deploy_contract "eligibility_chainmeet_8903" "Eligibility"

# Deploy Attendance Contract
deploy_contract "attendance_chainmeet_1735" "Attendance"

# Summary
echo "=================================================="
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo -e "${YELLOW}📝 Deployment Summary:${NC}"
echo ""

for CONTRACT in "Meeting" "Eligibility" "Attendance"; do
    if [ ! -z "${PROGRAM_IDS[$CONTRACT]}" ]; then
        echo -e "${GREEN}✅ ${CONTRACT}:${NC}"
        echo -e "   Program ID: ${PROGRAM_IDS[$CONTRACT]}"
        if [ ! -z "${TX_IDS[$CONTRACT]}" ]; then
            echo -e "   Transaction ID: ${TX_IDS[$CONTRACT]}"
        fi
        echo ""
    fi
done

# Save to file
DEPLOYMENT_FILE="deployed_testnet_$(date +%Y%m%d_%H%M%S).txt"
cat > "$DEPLOYMENT_FILE" << EOF
# ChainMeet Contract Deployment - $(date)
Network: $NETWORK
Endpoint: $ENDPOINT

## Program IDs (Add these to frontend/.env.local)

NEXT_PUBLIC_MEETING_PROGRAM_ID=${PROGRAM_IDS[Meeting]}
NEXT_PUBLIC_ELIGIBILITY_PROGRAM_ID=${PROGRAM_IDS[Eligibility]}
NEXT_PUBLIC_ATTENDANCE_PROGRAM_ID=${PROGRAM_IDS[Attendance]}

## Transaction IDs

Meeting: ${TX_IDS[Meeting]}
Eligibility: ${TX_IDS[Eligibility]}
Attendance: ${TX_IDS[Attendance]}
EOF

echo -e "${GREEN}📄 Deployment info saved to: ${DEPLOYMENT_FILE}${NC}"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "1. Copy the Program IDs above"
echo "2. Add them to frontend/.env.local:"
echo ""
echo "   NEXT_PUBLIC_MEETING_PROGRAM_ID=${PROGRAM_IDS[Meeting]}"
echo "   NEXT_PUBLIC_ELIGIBILITY_PROGRAM_ID=${PROGRAM_IDS[Eligibility]}"
echo "   NEXT_PUBLIC_ATTENDANCE_PROGRAM_ID=${PROGRAM_IDS[Attendance]}"
echo ""
echo "3. Run: cd ../frontend && npm run dev"
echo ""
