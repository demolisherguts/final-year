# DocScan Viva Questions (101–120)

---

## 101. What is RPC? What RPC URL do you use (e.g. Hardhat, Sepolia)?

**Answer:** **RPC (Remote Procedure Call)** is how the frontend talks to the blockchain: it sends requests (e.g. “call this function,” “send this transaction”) to a **node** via an HTTP/WebSocket URL. For **Hardhat local node** we use something like `http://127.0.0.1:8545`. For **Sepolia testnet** we would use a provider URL (e.g. Infura, Alchemy). MetaMask uses the RPC of the network the user has selected (e.g. Localhost 8545 or Sepolia).

---

## 102. How do you deploy the contract? Which network (local, testnet, mainnet)?

**Answer:** We use **Hardhat**: `npx hardhat run scripts/deploy.js --network <network>`. For **local**: first run `npx hardhat node`, then `--network localhost`. For **ephemeral** testing we can use `--network hardhat` (in-memory). For **testnet** (e.g. Sepolia) we set SEPOLIA_RPC_URL and PRIVATE_KEY in .env and use `--network sepolia`. **Mainnet** would use a mainnet RPC and is only for production after auditing.

---

## 103. What is gas estimation? Have you measured gas for registerDocument and verifyDocument?

**Answer:** **Gas estimation** is asking the node how much gas a transaction would use (estimateGas). We can measure **actual gas** after a transaction (receipt.gasUsed). For **registerDocument** we would see gas for storage (mappings, event). For **verifyDocument** it is a **view** call and typically does not cost the user gas when called from outside (only the RPC node does the read). For the report, you can run registerDocument multiple times and record gasUsed to add a “Results” section.

---

## 104. How would you add QR codes for “instant verification” as mentioned in the objectives?

**Answer:** We could **generate a QR code** that encodes a **verification URL** plus the **document hash** (or a short token that resolves to the hash). For example: `https://docscan.example/verify?hash=0x...`. When someone scans the QR, they open that URL; the frontend could auto-fill the hash and call verifyDocument, or we could have a “verify by hash” page where the hash is in the URL. The QR would be printed on the physical certificate or shared digitally for quick access.

---

## 105. If two students submit the same certificate (same file), will both get the same hash? So only one can register?

**Answer:** Yes. The **hash depends only on the file content**. So the same file ⇒ same hash. The **first** registration of that hash succeeds; any **second** attempt (by the same or another user) would hit **DocumentAlreadyRegistered** and fail. So only **one** on-chain record exists per unique document content. If two students have the same certificate (e.g. duplicate issued by university), only one can register; the other could still verify using the same file.

---

## 106. Can a university register a document on behalf of a student? In your current design, who is the “owner”?

**Answer:** In the **current design**, **msg.sender** (the address that signs the transaction) is stored as **owner**. So whoever calls registerDocument is the owner—it could be the **student** (if they connect their wallet) or the **university** (if they connect an institutional wallet). We do not yet have “register on behalf of” with a different owner. To have the university register with the student as owner, we could add a function like registerDocumentFor(address student, ...) restricted to approved issuers and set owner = student.

---

## 107. What stops a fake university from joining and issuing certificates in your system?

**Answer:** In the **current implementation**, **nothing** stops any address from calling registerDocument. So a fake university could register hashes. The **proposed** mitigation in the synopsis is the **Owner/curator** role: only **approved issuer addresses** would be allowed to register (or to register on behalf of others). That way, only validated institutions can issue; we have not fully implemented this yet.

---

## 108. Why not use a permissioned blockchain (e.g. Hyperledger) instead of Ethereum?

**Answer:** **Ethereum** (or similar public chain) offers **permissionless** participation and **transparency**: anyone can verify without being a member. **Permissioned** chains (e.g. Hyperledger) give more control and privacy but require **invitation** and **trust in the consortium**. For **academic credentials**, we want employers and third parties to verify without joining a private network; a public or public testnet fits that. Permissioned chains could be chosen for stricter governance or enterprise integration as future work.

---

## 109. What is the cost (in gas or money) to register one document? Is it scalable to millions?

**Answer:** **Cost** depends on gas price and network. On **Hardhat/local** it is free (or test ether). On **testnet/mainnet** we’d measure gas for registerDocument (storage + event) and multiply by gas price. **Scalability:** Each registration is one transaction; **millions** of documents mean millions of transactions, so **throughput** is limited by block space and **cost** can add up. Solutions include **batch registration** (multiple hashes in one tx), **layer-2**, or **sidechains** to keep cost and load acceptable at scale.

---

## 110. How do you handle document updates or revocations (e.g. degree cancelled)?

**Answer:** The **current system does not** support updates or revocations. Records are **immutable** once registered. To add **revocation**, we could: (1) Add a mapping `revoked[documentHash]` and a function `revoke(documentHash)` (restricted to owner or issuer); in verifyDocument we’d also check revoked. (2) Or add a “status” field (active/revoked) that can be updated. This would be **future work**.

---

## 111. What if the backend or your IPFS node is compromised? What can an attacker do?

**Answer:** If the **backend** is compromised: the attacker could **tamper** with the file before hashing or upload a **different file** to IPFS and return a **wrong CID or hash** to the frontend—so the wrong content could be registered or verification could be misleading. Mitigations: run a **trusted backend**, **audit** it, or move hashing/upload to the **client** where possible. If **IPFS** is compromised: they could try to drop or alter content; pinning on multiple services and verifying hash after retrieval reduces risk. The **on-chain hash** remains the source of truth for “what was registered.”

---

## 112. How is your solution “decentralized” if there is a central backend and (possibly) a single IPFS gateway?

**Answer:** **Decentralization** is **layered**: (1) **Blockchain** is decentralized—no single party can alter registered hashes. (2) **IPFS** is a distributed network; many nodes can hold and serve content. (3) The **backend** is a **centralized** component we use for convenience (hashing, IPFS client). We could **reduce** centralization by: doing hashing and IPFS add in the **browser** (e.g. js-ipfs or a public gateway), or by running multiple backends. So the **core trust** (proof of registration) is decentralized; the **upload path** can be made more decentralized in future.

---

## 113. What is the novelty or originality of your project in one sentence?

**Answer:** We combine **on-chain certificate hashes** with **IPFS storage** in a single verification flow and propose an **Owner/curator** layer so that both **document integrity** and **institutional authenticity** are addressed in one decentralized framework for students, universities, and employers.

---

## 114. Summarize your project in 2 minutes.

**Answer:** DocScan is a **decentralized academic document verification** system. Students or institutions **upload** a certificate; the file goes to **IPFS**, and its **SHA-256 hash** and **IPFS CID** are stored on the **Ethereum blockchain** via a smart contract. Anyone can **verify** a document by uploading the file: we recompute the hash and check the contract; if it matches, the document is genuine and unaltered. The **frontend** is React with MetaMask; the **backend** does hashing and IPFS. We use a **two-tier** design—proof on-chain, file off-chain—for cost and scalability, and we propose an **Owner** role to approve institutions and close the gap between credential integrity and issuer authenticity.

---

## 115. What was the hardest part to implement and why?

**Answer:** (You can adapt based on your experience.) Examples: **Integrating** frontend, backend, IPFS, and contract so that hashes and CIDs match and the flow is smooth. **Handling** IPFS availability and errors in the backend. **Getting** the correct bytes32 and ABI so the contract accepts the hash from the backend. **Designing** the contract so that verification is gas-free (view) and duplicate registration is prevented.

---

## 116. What would you do differently if you started again?

**Answer:** (Suggestions.) (1) Implement **Owner/issuer** access control from the start. (2) Add **revocation** in the first version. (3) Consider **client-side** hashing and IPFS (e.g. via gateway) to reduce backend dependency. (4) Define **gas and latency** tests early and run them as part of the report. (5) Use **TypeScript** and shared types between frontend and backend for fewer bugs.

---

## 117. How many team members and how did you divide the work (smart contract, backend, frontend)?

**Answer:** (From the synopsis: Kriti Dubey, Lakshay Bansal, Lakshay Gupta, Lakshay Gupta, under Mr. Gaurav Kumar.) Work was split roughly as: **Design & architecture**—collaborative; **Smart contract & backend**—one member; **Frontend & integration**—another member; with **weekly meetings** with the supervisor. You can state the actual division your team used.

---

## 118. What tools did you use (Hardhat, Truffle, Ganache, MetaMask, React, Node, IPFS)?

**Answer:** **Blockchain:** Ethereum, Solidity 0.8.20, **Hardhat** (compile, test, deploy), local node. **Backend:** **Node.js**, **Express**, **ipfs-http-client**, **multer**, **crypto** (SHA-256). **Frontend:** **React**, **Vite**, **ethers.js**, **MetaMask**. **Storage:** **IPFS**. The synopsis also mentions Ganache and Truffle as alternatives; we used Hardhat for the implementation.

---

## 119. Where can someone try your system (local, testnet URL, repo)?

**Answer:** **Locally:** Clone the repo, run `npm run node`, deploy with `npm run deploy:local`, set `VITE_CONTRACT_ADDRESS` in frontend/.env, run backend and frontend, connect MetaMask to Localhost 8545. **Testnet:** Deploy to Sepolia (or another testnet), share contract address and app URL if hosted. **Repo:** Share the GitHub/repository link so evaluators can clone and run following the README.

---

## 120. What is a DApp? Is DocScan a DApp? Why or why not?

**Answer:** A **DApp (decentralized application)** is an application that uses a **blockchain** (and often smart contracts) for part of its logic or data, often with a frontend and sometimes with off-chain components. **DocScan is a DApp** because: (1) It has a **smart contract** on Ethereum that holds the verification state. (2) Users interact via a **frontend** that connects to the blockchain (MetaMask). (3) Critical data (document hashes, ownership) is **stored and verified on-chain**. The backend and IPFS are supporting parts; the **trust and verification** are decentralized on the chain.

---

*Prev: [viva-questions-5.md](viva-questions-5.md) · Back to start: [viva-questions-1.md](viva-questions-1.md)*
