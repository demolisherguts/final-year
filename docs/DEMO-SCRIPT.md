# DocScan – Demo Script

Use this when giving a live demo. Run `./start-all.sh` first; it will print Hardhat accounts so you can import them into MetaMask.

---

## Before the demo (5 min)

### 1. Start services

```bash
./start-all.sh
```

- **Hardhat accounts** are printed right after the node starts (Account #0, #1, … with private keys). Copy **Account #0**’s private key for the **contract owner** (Admin + first approved issuer). Copy **Account #1**’s private key if you want a second wallet to act as “university” after you approve it.
- If you use IPFS for uploads: in another terminal run `ipfs daemon`.

### 2. MetaMask

- Add network **Hardhat Local**: RPC `http://127.0.0.1:8545`, Chain ID **31337**.
- **Import Account #0**: MetaMask → Account menu → Import account → paste **Account #0**’s private key from the `./start-all.sh` output. This is the **contract owner** (can use Admin and register).
- Optional: **Import Account #1** (second key from the script output) to demo “approve an issuer, then register as that issuer.”
- Switch to **Hardhat Local**.

### 3. Browser

- Open http://localhost:5173.
- Have a **sample PDF** ready (e.g. a certificate).

---

## Demo script (about 8–10 min)

### 1. Introduction (30 sec)

*“This is **DocScan** — **decentralized document verification** using **blockchain** and **IPFS**. Only **verified institutions** (universities, companies, government) can **register** documents; **anyone** can **verify** that a document is registered and unchanged.”*

---

### 2. Connect as owner (30 sec)

- Click **Connect Wallet**, approve in MetaMask.
- Confirm you’re on **Hardhat Local**.
- Point out the **Dashboard**: Upload, Verify, My Documents. If you’re the contract owner, you’ll also see **Admin**.

---

### 3. Approved issuers / Admin (1–2 min)

- Go to **Admin** (only visible when connected as the **contract owner** — Account #0).
- Say: *“Only **approved issuers** can register documents. The **contract owner** adds them here.”*
- **Option A – Quick:** Say *“The deployer is already an approved issuer, so we can register from this account.”* Then go to step 4.
- **Option B – Full flow:**  
  - Copy **Account #1**’s address from the Hardhat accounts list (or use any second address).  
  - In Admin, paste the address, click **Approve issuer**, confirm in MetaMask.  
  - Say: *“That address can now register documents as a verified institution. In production, that would be a university or government wallet.”*  
  - Optional: switch MetaMask to Account #1, connect again, show that Upload is now enabled; then switch back to Account #0 for the rest of the demo.

---

### 4. Upload / register a document (1–2 min)

- Go to **Upload**.
- Say: *“As an approved issuer, I’ll **register** a document. The file goes to **IPFS**; only its **hash** is stored on-chain.”*
- **Choose file**: your sample PDF.
- **Document name**: e.g. “Degree Certificate 2024”.
- Click **Upload to IPFS & Register on Chain**, confirm in MetaMask.
- When it succeeds: *“We get an **IPFS** link and **transaction hash**. The hash is the **fingerprint** of this file. Any change to the file changes the hash, so verification would fail.”*
- Optionally use **Copy** for IPFS and Tx hash.

---

### 5. Verify the same document (1–2 min)

- Go to **Verify**.
- Say: *“Now we **verify** that this document is registered and **unchanged**. An employer or anyone can do this with the same PDF.”*
- **Choose file**: the **same** PDF you uploaded.
- Click **Verify on Chain**.
- When **Verified** appears: *“The system hashed the file and checked the **blockchain**. Same hash → same document → **not altered**.”*
- Show the **Verified** badge and details (owner, IPFS, date). Optionally **Copy** owner or hash.

---

### 6. Show “altered” document (optional, 1 min)

- Change one letter in the PDF (or re-save with a small edit), save as a new file.
- In **Verify**, upload this **modified** file.
- Say: *“This is the same certificate but **edited**.”*
- Click **Verify on Chain** → **Not registered**. Say: *“The hash of the modified file doesn’t match the one on-chain, so we know the document was **altered**.”*

---

### 7. My Documents (30 sec)

- Go to **My Documents**.
- Say: *“Here are all documents **this wallet** has registered. Each shows name, hash, IPFS link, and date.”*
- Show one row; optionally **Copy** hash or IPFS link.

---

### 8. Wrap-up (30 sec)

- *“DocScan gives **tamper-proof verification**: only **verified institutions** can register; the hash on-chain never changes; any change to the file changes the hash so verification fails. Students or employers can **verify** in seconds without calling the university.”*
- If asked: *“We use **Ethereum** (or testnet) for the hash and **IPFS** for the file so we don’t store large files on-chain. The **Admin** page is only for the contract owner to add or remove approved issuers.”*

---

## Quick checklist

- [ ] Run `./start-all.sh`; note Hardhat accounts printed (Account #0 = owner).
- [ ] MetaMask: Hardhat Local added; Account #0 (and optionally #1) imported.
- [ ] Browser: http://localhost:5173, one sample PDF ready.
- [ ] Demo flow: Connect (owner) → **Admin** (show approver, optionally approve Account #1) → **Upload** (register PDF) → **Verify** (same PDF → Verified) → optional altered PDF → **My Documents** → wrap-up.

---

## If something fails

- **“Could not read from contract”** → MetaMask must be on **Hardhat Local** (31337). Restart frontend if you changed `.env`.
- **Upload disabled / “Only verified institutions”** → You’re not an approved issuer. Connect with **Account #0** (deployer) or have the owner add your address in **Admin**.
- **No Admin link** → Only the **contract owner** (deployer = Account #0) sees Admin. Connect with that account.
- **Upload fails (IPFS)** → Say “IPFS is optional for demo; we’d use a pinning service in production.” Or run `ipfs daemon`.
- **Duplicate registration** → Use a **different** PDF or say “This document is already registered; we prevent duplicates.”

Good luck with your demo.
