# DocScan Viva Questions (21–40)

---

## 21. How does content-addressed storage (IPFS) differ from location-addressed (URL)?

**Answer:** **Content-addressed** means the identifier is computed from the file’s content (e.g. hash). Same content ⇒ same ID; content cannot change without the ID changing. **Location-addressed** (URL) points to a server/path; the content at that location can change. So content-addressed storage gives **integrity** and **deduplication**; location-addressed gives a fixed “place” that may change over time.

---

## 22. Why not store the full certificate on the blockchain?

**Answer:** Storing full certificates on-chain would be **extremely costly** in gas and would **bloat the blockchain** with large data. Blockchains are better for small, critical data (like hashes and metadata). Keeping the file on IPFS and only the hash and CID on-chain gives **verifiability** at low cost and keeps the chain lean.

---

## 23. What is “pinning” in IPFS? Why is it important in your backend?

**Answer:** **Pinning** tells IPFS to **keep** a piece of content and not discard it during garbage collection. Without pinning, nodes may delete content they don’t need. In our backend, we pin uploaded documents so they remain available for verification and retrieval. Without pinning, the document could disappear from the network.

---

## 24. What is a cryptographic hash (e.g. SHA-256)? What are its properties?

**Answer:** A **cryptographic hash** (e.g. **SHA-256**) is a function that takes any input and produces a **fixed-size** output (e.g. 256 bits). Properties: **deterministic** (same input ⇒ same output), **one-way** (hard to get input from output), **collision-resistant** (hard to find two inputs with the same hash). We use it to create a unique “fingerprint” of the document.

---

## 25. Why use SHA-256 for the document hash in your system?

**Answer:** SHA-256 is **standard**, **well-tested**, and produces a **256-bit (32-byte)** output that fits in Ethereum’s `bytes32`. It is **collision-resistant**, so we can trust that if the hash matches, the document is the same. It is widely supported in libraries and smart contracts.

---

## 26. How does storing the hash on-chain help in verifying that a document was not tampered with?

**Answer:** When we **register**, we compute the document’s hash and store it on-chain. When we **verify**, we recompute the hash of the file the user provides and **compare** it to the on-chain hash. If they match, the file is identical to the one that was registered; any tampering would change the hash and the verification would fail.

---

## 27. What is the difference between the “document hash” and the “IPFS hash” (CID) in your design?

**Answer:** The **document hash** (SHA-256, bytes32) is computed from the **file content** and is used for **integrity**: we store it on-chain and use it to verify that the document has not been altered. The **IPFS hash (CID)** is the **content identifier** used to **retrieve** the file from IPFS. Both are derived from content but serve different roles: one for proof, one for storage/lookup.

---

## 28. If someone changes one bit in the PDF, what happens to the hash? How does that help verification?

**Answer:** Changing **one bit** in the file produces a **completely different** hash (avalanche effect). So when we verify, we recompute the hash of the submitted file; if it does not match the on-chain hash, we know the file was modified. This makes tampering detectable without storing the full file on-chain.

---

## 29. Why store the hash in bytes32 in the smart contract?

**Answer:** **bytes32** is a fixed 32-byte type in Solidity, which matches **SHA-256** output (256 bits = 32 bytes). It is efficient for storage and comparison. Using a fixed type also keeps gas predictable and allows the hash to be used as a mapping key (e.g. `documentsByHash[documentHash]`).

---

## 30. Describe the “two-tier” or “two-layer” design (on-chain vs off-chain).

**Answer:** **On-chain (Layer 1):** The Ethereum smart contract stores only **metadata**: IPFS CID, document hash (bytes32), owner address, timestamp, document name. This gives immutability and public verifiability. **Off-chain (Layer 2):** The **actual document** is stored on **IPFS**. This keeps cost and chain size low while still allowing retrieval via the stored CID.

---

## 31. Explain the end-to-end flow from “user uploads document” to “document is verified on-chain.”

**Answer:** **Upload/Register:** User selects file and name → frontend sends file to backend → backend hashes file (SHA-256), uploads to IPFS, gets CID → backend returns hash and CID → frontend calls `registerDocument(ipfsHash, documentHash, documentName)` → user signs in MetaMask → transaction is mined → document is registered. **Verify:** User uploads file → backend computes hash → frontend calls `verifyDocument(documentHash)` → contract returns stored record (or “not found”) → frontend shows verified or not.

---

## 32. What is stored on-chain and what is stored off-chain? Why this split?

**Answer:** **On-chain:** IPFS CID (string), document hash (bytes32), owner address, timestamp, document name. **Off-chain:** The actual file (e.g. PDF) on IPFS. The split keeps the chain small and cheap (only hashes and metadata) while still allowing full document storage and retrieval via IPFS. Integrity is guaranteed by the on-chain hash.

---

## 33. Draw or explain the document upload flow (user → backend → IPFS → contract).

**Answer:** (1) User selects file and document name in the frontend. (2) Frontend sends file to backend (POST /api/upload). (3) Backend computes SHA-256 hash, uploads file to IPFS, gets CID. (4) Backend returns ipfsHash (CID) and documentHash (bytes32 hex). (5) Frontend calls contract.registerDocument(ipfsHash, documentHash, documentName). (6) User approves transaction in MetaMask. (7) Transaction is mined; document is registered on-chain.

---

## 34. Draw or explain the verification flow (user uploads file → backend hash → contract check).

**Answer:** (1) User selects the file to verify in the frontend. (2) Frontend sends file to backend (POST /api/hash). (3) Backend computes SHA-256 and returns documentHash. (4) Frontend calls contract.verifyDocument(documentHash) (read-only, no gas for the user in typical setups). (5) Contract returns exists, ipfsHash, owner, timestamp, documentName. (6) Frontend shows “Verified” with details, or “Not registered” if exists is false.

---

## 35. What is the role of the backend (Node.js)? Why not do everything in the frontend?

**Answer:** The backend **handles file processing** (hashing, IPFS upload) and **keeps the IPFS client and API keys** (if any) server-side. Doing IPFS upload from the frontend would require exposing IPFS gateway or API to the browser and might have CORS/security limits. The backend also provides a single place to enforce limits (e.g. file size) and to log or monitor uploads.

---

## 36. Why use React for the frontend? What does the frontend do vs the backend?

**Answer:** **React** gives a component-based UI, good tooling, and easy integration with ethers.js and MetaMask. The **frontend** handles: wallet connection, forms (upload/verify), calling the backend for hash/IPFS, and calling the smart contract (register/verify). The **backend** handles: hashing, IPFS upload, and returning CIDs and hashes. So frontend = user interaction + blockchain; backend = file processing + IPFS.

---

## 37. What is the “Owner” entity mentioned in the novelty? How does it improve trust?

**Answer:** The synopsis mentions an **“Owner” entity** that **validates and onboards** legitimate universities and companies. This adds a **governance layer**: only approved institutions can issue or verify credentials, reducing the risk of fake institutions joining and issuing valid-looking but fraudulent certificates. In the current implementation we have a single contract owner; the full “Owner as curator” role can be added as an extension (e.g. access control for who can register).

---

## 38. What does registerDocument do? What are its parameters and what does it store?

**Answer:** **registerDocument(ipfsHash, documentHash, documentName)** registers a document on-chain. Parameters: `ipfsHash` (IPFS CID string), `documentHash` (bytes32, SHA-256 of the file), `documentName` (string). It validates inputs (non-empty), checks that the hash is not already registered, then stores in mappings: documentsByHash[documentHash], documentsByOwner[msg.sender], and emits DocumentRegistered. The caller (msg.sender) is stored as the owner.

---

## 39. What does verifyDocument do? Is it a read (view) or a write? Why is that useful?

**Answer:** **verifyDocument(documentHash)** is a **view** function: it only reads state and does not modify it. It returns (exists, ipfsHash, owner, timestamp, documentName) for the given hash. Because it is read-only, it does not require a transaction or gas from the user when called from outside; anyone can verify a document without paying gas, which is important for usability.

---

## 40. How do you prevent the same document (same hash) from being registered twice?

**Answer:** We maintain a mapping **registeredHashes[documentHash]**. Before storing a new record, we check `if (registeredHashes[documentHash]) revert DocumentAlreadyRegistered();`. After validation, we set `registeredHashes[documentHash] = true`. Since the hash is unique to the document content, the same file cannot be registered again by anyone.

---

*Prev: [viva-questions-1.md](viva-questions-1.md) · Next: [viva-questions-3.md](viva-questions-3.md) (Questions 41–60)*
