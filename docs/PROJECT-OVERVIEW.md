# DocScan – Project Overview (Simple & Detailed)

A clear, full overview of the project that anyone can understand.

---

## What is DocScan?

**DocScan** is a system to **register and verify academic documents** (like degree certificates, mark sheets, transcripts) in a **secure, tamper-proof, and fast** way using **blockchain** and **decentralized file storage (IPFS)**.  

Instead of relying on paper copies, phone calls, and manual checks, students and institutions can **upload** a document once and **anyone** (universities, employers) can **verify** that it is real and unchanged by checking it against the blockchain.

---

## The Problem We Solve

### How verification works today (and why it’s a problem)

Today, when you need to prove that your degree or certificate is real:

1. You **send** physical or scanned copies to universities or companies.
2. They **contact** your college or university to confirm.
3. The university **checks** its own records and replies (often by post or email).
4. This can take **days or weeks**, uses **paper and postage**, and still **doesn’t rule out** fake or altered documents.

**Issues:**

- **Slow** – Admissions and hiring get delayed.
- **Manual** – Lots of phone calls, emails, and paperwork.
- **Unreliable** – Documents can be forged or edited with simple tools.
- **No single source of truth** – Every institution checks separately; there’s no shared, trusted record.

### What we want instead

We want:

- **Instant** verification (minutes, not weeks).
- **No dependence** on one university or one server.
- **Mathematical guarantee** that the document has not been changed after it was registered.
- **One place** where “this document is genuine” is recorded and can be checked by anyone.

DocScan does exactly that using **blockchain** and **IPFS**.

---

## High-Level Idea: Two Layers

We split the work into two layers:

1. **On-chain (blockchain)**  
   We store only a **short fingerprint (hash)** of the document and who registered it.  
   This is **small, cheap, and cannot be changed** once written. It is the **proof** that “this document was officially registered.”

2. **Off-chain (IPFS)**  
   We store the **actual file** (e.g. PDF) on a **decentralized storage network** called IPFS.  
   This keeps the blockchain light and fast, while still allowing anyone with the right link to **fetch the document** if needed.

So: **proof and ownership live on the blockchain**; **the file itself lives on IPFS**. Together they give **trust + storage** without putting huge files on the chain.

---

## Who Uses DocScan?

Three main types of users:

| User | What they do |
|------|-------------------------------|
| **Students** | Upload their certificates/transcripts and register them on the blockchain. Later they (or others) can verify the same document. |
| **Universities / Institutions** | Can register documents they issue (e.g. degrees) so that employers and other universities can verify them. |
| **Employers / Verifiers** | Upload the document they received (e.g. from a candidate) and check in seconds whether it is **registered and unchanged** on the blockchain. |

Everyone uses the **same web app**: connect wallet → Upload or Verify → get a clear result.

---

## How It Works (Step by Step)

### Part 1: Registering a document

1. **User** opens the DocScan app and connects their **wallet** (e.g. MetaMask). The wallet is like a login that also pays small fees on the blockchain.
2. User goes to **Upload**, selects the **document file** (e.g. PDF) and enters a **document name** (e.g. “B.Tech Degree 2024”).
3. The **browser** sends the file to our **backend server**.
4. The backend:
   - Computes a **hash** (SHA-256) of the file. This is a short, unique “fingerprint”: same file ⇒ same hash; any change ⇒ different hash.
   - Uploads the **file** to **IPFS** and gets back a **content ID (CID)** – a link to that file in the decentralized storage.
5. The backend sends the **hash** and **CID** back to the **frontend**.
6. The frontend calls the **smart contract** on the blockchain: “Register this document: this hash, this CID, this name, and I am the owner (my wallet address).”
7. The user **approves** this in MetaMask (one click). The transaction is sent to the blockchain.
8. The blockchain **stores** the hash, CID, owner, timestamp, and name. This record is **permanent and tamper-proof**. Registration is done.

**In short:** File → backend → hash + IPFS → smart contract → user signs → data stored on blockchain.

---

### Part 2: Verifying a document

1. **Verifier** (e.g. employer) has a copy of the certificate (PDF) they want to check.
2. They open DocScan, go to **Verify**, and **upload that same file**.
3. The file is sent to our **backend**, which again computes the **SHA-256 hash** of the uploaded file.
4. The frontend asks the **smart contract**: “Is this hash registered? If yes, who registered it and when?”
5. The contract **reads** from the blockchain (no fee for the user in normal setups) and returns: **yes/no** and, if yes, **owner, time, document name, IPFS link**.
6. The app shows: **“Verified”** (with details) or **“Not registered”**.

**In short:** Upload file → backend hashes it → contract checks hash → show Verified or Not registered.

**Why it’s trustworthy:**  
If someone had changed the PDF (e.g. name, grade), the hash would be different and the contract would say “not found.” So we know the document is **exactly** the one that was registered.

---

## Main Parts of the System (Technical in Simple Terms)

| Part | What it is | Role in DocScan |
|------|------------|------------------|
| **Blockchain (Ethereum)** | A shared, unchangeable ledger that many computers maintain. | Stores the document hash, IPFS link, owner, and time. No one can edit this after it’s written. |
| **Smart contract** | A small program on the blockchain that has strict rules (e.g. “store this hash,” “answer yes/no for this hash”). | Defines how we register and verify; everyone uses the same contract so the rules are transparent and fair. |
| **IPFS** | A decentralized way to store and retrieve files by content (not by server URL). | Holds the actual PDF so we don’t put big files on the blockchain. We only put the IPFS link (CID) on-chain. |
| **Hash (SHA-256)** | A short, unique fingerprint of the file. Same file ⇒ same hash; change one bit ⇒ different hash. | Used to prove the document wasn’t tampered with. We store this fingerprint on the blockchain. |
| **Backend (Node.js)** | Our server that receives the file, computes the hash, and talks to IPFS. | Does hashing and IPFS upload; returns hash and CID to the frontend so it can call the contract. |
| **Frontend (React)** | The website the user sees (upload form, verify form, “My documents”). | Connects the user’s wallet, talks to the backend and to the blockchain, and shows results. |
| **MetaMask** | A browser wallet that holds the user’s keys and signs blockchain transactions. | Lets the user “log in” with their address and pay the small fee to register a document; the website never sees the private key. |

---

## Why Blockchain? Why Not Just a Normal Database?

- A **normal database** is controlled by one organization. They can change or delete data, or the server can go down. Trust depends entirely on that one party.
- The **blockchain** is maintained by many nodes; data, once written, is practically **immutable**. So:
  - **Integrity** – The hash we stored cannot be silently changed.
  - **Transparency** – Anyone can check what was registered and when.
  - **No single point of failure** – No one company or server “owns” the proof.

So we use the blockchain **only for the proof** (hash + who + when); we use IPFS for the **file** to keep cost and size under control.

---

## Why IPFS? Why Not Store the File on the Blockchain?

- Storing **large files** on the blockchain is **very expensive** (gas fees) and would make the chain huge and slow.
- **IPFS** is built for files: it’s **cheaper**, **scalable**, and still **decentralized**. We store the **CID (link)** on the blockchain so that the proof (hash) and the way to get the file (CID) are both on-chain, but the file itself is off-chain.

---

## What “Tamper-Proof” and “Verification” Mean Here

- **Tamper-proof:** Once a document is registered, the **hash** on the blockchain cannot be changed. If someone alters the PDF later, the **new** file will have a **different** hash, so when you verify, the contract won’t find a match → verification fails. So we can tell if the document was modified.
- **Verification:** We **don’t** verify that the content of the document is “true” in real life (e.g. we don’t check if the university really gave that grade). We verify that **(1)** this exact file was **registered** on our system and **(2)** the file you’re checking is **byte-for-byte the same** as the one that was registered. That’s enough to stop forgeries and alterations of the digital file.

---

## What We Built (Summary)

- **Smart contract** (Solidity) – Register document (hash, IPFS link, name); verify by hash; list “my documents.”
- **Backend** (Node.js + Express) – Upload API (hash + IPFS), hash-only API for verification, health/stats.
- **Frontend** (React) – Connect wallet, Upload, Verify, My Documents; talks to backend and to the contract via MetaMask.
- **Docs and Q&A** – README, setup instructions, and viva-style questions with answers.

---

## In One Sentence

**DocScan lets students or institutions register academic documents on the blockchain (by storing only a hash and an IPFS link) and lets anyone verify in seconds that a given document is the same, unaltered file that was registered—making verification fast, transparent, and tamper-proof.**

---

*For setup and running the project, see the main [README](../README.md). For viva/preparation, see the [docs](README.md) folder.*
