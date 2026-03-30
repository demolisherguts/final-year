#!/usr/bin/env bash
# DocScan: start Hardhat node, deploy contract, set frontend .env, start backend + frontend.
# Run from project root: ./start-all.sh

set -e
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

# PIDs to kill on exit
NODE_PID=""
BACKEND_PID=""

cleanup() {
  echo ""
  echo "Shutting down..."
  [ -n "$BACKEND_PID" ] && kill "$BACKEND_PID" 2>/dev/null || true
  [ -n "$NODE_PID" ] && kill "$NODE_PID" 2>/dev/null || true
  exit 0
}
trap cleanup SIGINT SIGTERM

echo "=== 1. Starting Hardhat node (localhost:8545) ==="
npx hardhat node > /tmp/docscan-hardhat.log 2>&1 &
NODE_PID=$!
echo "    Waiting for node to be ready..."
sleep 5
if ! kill -0 $NODE_PID 2>/dev/null; then
  echo "    Failed to start Hardhat node. Check /tmp/docscan-hardhat.log"
  exit 1
fi
echo "    Node running (PID $NODE_PID)"
echo ""
echo "=== Hardhat accounts (copy for MetaMask) ==="
head -80 /tmp/docscan-hardhat.log | grep -E "Account #|Private Key:" || true
echo ""

echo "=== 2. Deploying DocumentRegistry to localhost ==="
DEPLOY_OUTPUT=$(npx hardhat run scripts/deploy.js --network localhost 2>&1)
echo "$DEPLOY_OUTPUT"
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "VITE_CONTRACT_ADDRESS=" | sed 's/.*VITE_CONTRACT_ADDRESS=//' | tr -d '\r')
if [ -z "$CONTRACT_ADDRESS" ]; then
  echo "    Could not parse contract address from deploy output."
  exit 1
fi
echo "    Contract address: $CONTRACT_ADDRESS"

echo ""
echo "=== 3. Writing frontend/.env ==="
mkdir -p frontend
echo "VITE_CONTRACT_ADDRESS=$CONTRACT_ADDRESS" > frontend/.env
echo "VITE_API_URL=" >> frontend/.env
echo "    frontend/.env updated"

echo ""
echo "=== 4. Starting backend (port 3001) ==="
(cd backend && node server.js) > /tmp/docscan-backend.log 2>&1 &
BACKEND_PID=$!
sleep 2
if ! kill -0 $BACKEND_PID 2>/dev/null; then
  echo "    Backend may have failed. Check /tmp/docscan-backend.log"
fi
echo "    Backend running (PID $BACKEND_PID)"

echo ""
echo "=== 5. Starting frontend (port 5173) ==="
echo "    Open http://localhost:5173 and connect MetaMask to Hardhat Local (RPC http://127.0.0.1:8545, Chain ID 31337)"
echo ""
cd frontend && npm run dev
