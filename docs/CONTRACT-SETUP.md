# Fix: "Could not read from contract"

This error means the app can’t talk to the contract. Do these steps in order.

---

## Step 1: Start the local blockchain

In a terminal:

```bash
cd project
npx hardhat node
```

Leave this running. You should see something like:

```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
...
```

---

## Step 2: Deploy the contract

Open a **new** terminal:

```bash
cd project
npx hardhat run scripts/deploy.js --network localhost
```

You should see:

```
DocumentRegistry deployed to: 0x...

Add this to frontend/.env (then restart the frontend):
VITE_CONTRACT_ADDRESS=0x...
```

Copy the **full address** (starts with `0x`).

---

## Step 3: Set the contract address in the frontend

1. Open **frontend/.env** (create it if it doesn’t exist).
2. Set the address (use the one from Step 2):

```
VITE_CONTRACT_ADDRESS=0xYourAddressFromDeploy
```

Example:

```
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

3. Save the file.

---

## Step 4: Add Hardhat Local to MetaMask

1. Open MetaMask.
2. Click the **network dropdown** (top) → **Add network** / **Add a network manually**.
3. Enter:

   | Field        | Value                  |
   |-------------|-------------------------|
   | Network name| Hardhat Local           |
   | RPC URL     | http://127.0.0.1:8545   |
   | Chain ID    | 31337                   |
   | Currency    | ETH                     |

4. Save.

---

## Step 5: Use test ETH on Hardhat Local

The Hardhat node gives test ETH to default accounts. To use one in MetaMask:

1. In the terminal where **Hardhat node** is running, find **Account #0** and its **Private Key** (in the list it prints at start).
2. In MetaMask: **Import account** → paste that **private key**.
3. Switch to the **Hardhat Local** network.

You should see ~10000 ETH. That account is the deployer and has the contract.

---

## Step 6: Restart the frontend

Env variables are read at build time, so restart the dev server:

```bash
cd project/frontend
npm run dev
```

Or stop the current `npm run dev` (Ctrl+C) and run it again.

---

## Step 7: Use the app

1. Open the app in the browser (e.g. http://localhost:5173).
2. Click **Connect Wallet** and choose the imported account.
3. Make sure the selected network is **Hardhat Local** (Chain ID 31337).
4. Go to **My Documents** (or Upload). It should load without the “Could not read from contract” error.

---

## Checklist

- [ ] `npx hardhat node` is running.
- [ ] Contract deployed with `npx hardhat run scripts/deploy.js --network localhost`.
- [ ] **frontend/.env** has `VITE_CONTRACT_ADDRESS=0x...` (same address as deploy).
- [ ] MetaMask has **Hardhat Local**: RPC `http://127.0.0.1:8545`, Chain ID **31337**.
- [ ] MetaMask has an account that has test ETH (e.g. imported Hardhat Account #0).
- [ ] Frontend was **restarted** after changing `.env`.
- [ ] In MetaMask you are on **Hardhat Local**, not Mainnet or Sepolia.

If you still see the error, the contract address or network is wrong. Deploy again (Step 2), copy the new address into **frontend/.env**, restart the frontend, and ensure MetaMask is on Hardhat Local.
