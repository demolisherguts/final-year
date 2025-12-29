# DocScan – Decentralized Document Verification

Academic document verification using **Blockchain** (Ethereum) and **IPFS**. Documents are stored off-chain on IPFS; only their SHA-256 hashes and IPFS CIDs are recorded on-chain for tamper-proof verification.

Based on the synopsis: *Decentralized Document Verification using Blockchain and IPFS* (B.Tech project, AKGEC / Dr. A.P.J. Abdul Kalam Technical University).

**→ [Detailed project overview (easy to understand)](docs/PROJECT-OVERVIEW.md)** – problem, solution, how it works, who uses it.

**→ [Fix "Could not read from contract"](docs/CONTRACT-SETUP.md)** – deploy contract, set `VITE_CONTRACT_ADDRESS`, add Hardhat Local to MetaMask.

## Architecture

- **On-chain:** Solidity smart contract stores document metadata (IPFS CID, SHA-256 hash, owner, timestamp, name). No document content on-chain.
- **Off-chain:** Files are stored on IPFS; backend computes SHA-256 and uploads to IPFS, returns CID and hash for registration.
- **Frontend:** React app with MetaMask; users upload documents, register hashes on-chain, and verify documents by hash.

## Prerequisites

- **Node.js** 18+
- **MetaMask** (or another Ethereum wallet)
- **IPFS** (local node or Infura/Pinata API). For local: [install IPFS](https://docs.ipfs.io/install/) and run `ipfs daemon` (API on port 5001).

## Quick Start (local only)

Use everything on your machine—no Sepolia or public network.

1. **Install dependencies once**
   ```bash
   npm install
   cd backend && npm install && cd ..
   cd frontend && npm install && cd ..
   ```

2. **Start everything**
   ```bash
   ./start-all.sh
   ```
   This starts the Hardhat node, deploys the contract, writes `frontend/.env`, starts the backend, then the frontend.

3. **In MetaMask**
   - Add network: **Hardhat Local** → RPC `http://127.0.0.1:8545`, Chain ID **31337**.
   - Import an account: use the **private key** of **Account #0** from the `npx hardhat node` output (in the terminal where you ran `./start-all.sh`, scroll up to see the list of accounts and keys).
   - Switch to **Hardhat Local**.

4. **Use the app**
   - Open http://localhost:5173 → Connect Wallet → Upload or Verify.  
   - (Optional) Run `ipfs daemon` in another terminal if you want real IPFS uploads; otherwise upload may fail at the IPFS step.)

**Stop:** Ctrl+C in the terminal running `./start-all.sh`.

---

### Option B: Manual steps (instead of start-all.sh)

### 1. Install dependencies (once)

```bash
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Start local blockchain (Hardhat)

```bash
npm run node
```

In another terminal, deploy the contract:

```bash
npm run deploy:hardhat
```

Copy the printed `CONTRACT_ADDRESS` for the next step.

### 3. Configure environment

**Backend** – create `backend/.env` (optional):

```
IPFS_URL=http://127.0.0.1:5001
PORT=3001
```

**Frontend** – create `frontend/.env`:

```
VITE_CONTRACT_ADDRESS=<CONTRACT_ADDRESS from deploy>
VITE_API_URL=http://localhost:3001
```

If the frontend is served by Vite with the proxy in `vite.config.js`, you can leave `VITE_API_URL` empty so `/api` goes to the backend.

### 4. Start IPFS (if using local node)

```bash
ipfs daemon
```

### 5. Start backend and frontend

```bash
# Terminal 1
npm run backend

# Terminal 2
npm run frontend
```

Open http://localhost:5173, connect MetaMask to the Hardhat network (e.g. chain ID 31337, RPC http://127.0.0.1:8545), and use **Upload** to register a document and **Verify** to check it.

## Project structure

```
contracts/          # Solidity – DocumentRegistry.sol
scripts/             # Hardhat deploy script
backend/             # Node.js + Express – IPFS upload, hashing, REST API
frontend/            # React + Vite – wallet, upload, verify, my documents
```

## API (backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/upload` | Upload file (multipart); returns `ipfsHash`, `documentHash` (bytes32 hex) |
| POST   | `/api/hash`   | Compute SHA-256 of file only (for verification) |
| GET    | `/api/stats`  | Service/IPFS status |
| GET    | `/api/health` | Health check |

**Example – get document hash with curl (must send the real file):**
```bash
curl -X POST http://localhost:3001/api/hash -F "document=@/path/to/your/file.pdf"
```
Or via the frontend proxy: `http://localhost:5173/api/hash` (with `-F "document=@file.pdf"`). The request body must include the actual file bytes; a multipart request with no file content will hash empty data and not match the on-chain hash.

## Smart contract

- **registerDocument(ipfsHash, documentHash, documentName)** – store IPFS CID and document hash on-chain (caller = owner).
- **verifyDocument(documentHash)** – view function; returns existence, ipfsHash, owner, timestamp, documentName.

## Testing

```bash
npm run compile
npm run test
```

## License

MIT.
