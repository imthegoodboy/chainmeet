#!/bin/bash

# ChainMeet - Deploy Single Contract to Testnet
# Usage: ./deploy-single.sh <contract-directory-name>

set -e

if [ -z "$1" ]; then
    echo "Usage: ./deploy-single.sh <contract-directory-name>"
    echo "Example: ./deploy-single.sh meeting_chainmeet_7879"
    exit 1
fi

CONTRACT_DIR=$1

# Configuration
PRIVATE_KEY="APrivateKey1zkpJxZnySB93VJjfRGVLiAhg9hwWUj5p31vScmwZXBqXgYX"
NETWORK="testnet"
ENDPOINT="https://api.explorer.provable.com/v2"

# Export environment variables
export PRIVATE_KEY=$PRIVATE_KEY
export ALEO_NETWORK=$NETWORK
export ALEO_ENDPOINT=$ENDPOINT

echo "🚀 Deploying ${CONTRACT_DIR} to ${NETWORK}..."
echo ""

cd "$CONTRACT_DIR"

# Deploy with all required flags including --yes for auto-confirm
leo deploy \
    --private-key "$PRIVATE_KEY" \
    --network "$NETWORK" \
    --endpoint "$ENDPOINT" \
    --broadcast \
    --yes

echo ""
echo "✅ Deployment complete!"
