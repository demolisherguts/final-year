# DocScan Viva Questions (41–60)

---

## 41. What validations does the contract perform (e.g. non-empty IPFS hash, document name)?

**Answer:** The contract checks: (1) **ipfsHash** is not empty (revert EmptyIpfsHash). (2) **documentHash** is not bytes32(0) (revert EmptyDocumentHash). (3) **documentName** is not empty (revert EmptyDocumentName). (4) **documentHash** has not already been registered (revert DocumentAlreadyRegistered). These validations ensure data quality and prevent duplicates.

---

## 42. What is an “event” in Solidity? Which event do you emit and why?

**Answer:** An **event** is a log emitted by the contract that external systems (frontends, indexers) can listen to. We emit **DocumentRegistered(documentHash, ipfsHash, owner, timestamp, documentName)** when a document is successfully registered. This allows the frontend to confirm registration without polling, and allows third parties to build indexes or notifications of new documents.

---

## 43. Why use a mapping (e.g. documentsByHash)? What are the keys and values?

**Answer:** **documentsByHash** is a mapping from **bytes32 documentHash** to **DocumentRecord** (struct with ipfsHash, documentHash, owner, timestamp, documentName, exists). We use it because verification is done by hash: given a hash, we need O(1) lookup to get the stored record. The key is the document hash; the value is the full metadata for that document.

---

## 44. How do you support “list my documents” (e.g. by owner)? Explain documentsByOwner or similar.

**Answer:** We use **documentsByOwner[owner]** which maps an **address** to an **array of document hashes** (bytes32[]). When we register a document, we push the documentHash to documentsByOwner[msg.sender]. To list “my documents,” we call getDocumentCountByOwner(myAddress), then for each index i we call getDocumentHashByOwnerIndex(myAddress, i), then for each hash we call verifyDocument(hash) to get full details.

---

## 45. What Solidity version did you use and why (e.g. 0.8.20)?

**Answer:** We used **Solidity 0.8.20** as specified in the synopsis. Version 0.8.x has built-in overflow checks and is widely supported. 0.8.20 is a stable release with good tooling (Hardhat, Etherscan) and security features like custom errors, which we use for gas-efficient reverts.

---

## 46. What are custom errors (e.g. DocumentAlreadyRegistered) and why use them instead of require messages?

**Answer:** **Custom errors** (e.g. `error DocumentAlreadyRegistered();`) are defined once and used with `revert DocumentAlreadyRegistered()`. They are **cheaper in gas** than long string messages in `require(condition, "message")` because the string is not stored in bytecode. They also give a consistent, machine-readable way for the frontend to detect and handle specific failure cases.

---

## 47. What REST endpoints does your backend expose?

**Answer:** The backend exposes: **POST /api/upload** (multipart file → IPFS + hash, returns ipfsHash, documentHash, fileName), **POST /api/hash** (multipart file → documentHash only), **GET /api/verify/:documentHash** (validates hash format; actual verification is on-chain via frontend), **GET /api/stats** (service and IPFS status), **GET /api/health** (health check).

---

## 48. What does POST /api/upload do step by step (receive file, hash, IPFS, return what)?

**Answer:** (1) Receive the file via multer (multipart). (2) Read the file buffer and compute SHA-256 hash in hex. (3) Convert to bytes32 format (0x + 64 hex chars). (4) Upload the buffer to IPFS via ipfs.add(), optionally pin. (5) Get the CID (ipfsHash) from the result. (6) Return JSON: ipfsHash, documentHash (bytes32 hex), documentHashHex, fileName.

---

## 49. What does POST /api/hash do? When is it used (e.g. during verification)?

**Answer:** **POST /api/hash** accepts a file (multipart) and returns only its **documentHash** (bytes32 hex) and documentHashHex. It does **not** upload to IPFS. It is used during **verification**: the user uploads the file they want to verify, the backend computes the hash, and the frontend uses that hash to call the contract’s verifyDocument(documentHash).

---

## 50. How do you convert the file to a hash in the backend? Which library or method?

**Answer:** We use Node.js built-in **crypto**: `crypto.createHash("sha256").update(buffer).digest("hex")`. This gives the SHA-256 hash of the file buffer as a hex string. We then convert that to the format expected by the contract (0x + 64 hex characters) for the bytes32 value.

---

## 51. How do you convert that hash to bytes32 format for the contract?

**Answer:** The backend gets a hex string from SHA-256 (with or without "0x"). We ensure it is 64 characters: `"0x" + hex.padStart(64, "0").slice(0, 64)`. This string is the bytes32 representation. The frontend passes it to the contract as-is; ethers.js treats it as bytes32. So we do not convert to bytes in the backend—we just format the hex string correctly.

---

## 52. What is multer? Why do you use it?

**Answer:** **Multer** is a middleware for handling **multipart/form-data** (file uploads) in Express. We use it so that when the frontend sends a file in a form, Express can parse it and provide the file buffer in `req.file`. We use **memoryStorage()** so the file is kept in memory (no disk write) and then we hash it and send it to IPFS.

---

## 53. What happens if IPFS is down when a user tries to upload?

**Answer:** The backend tries to add the file to IPFS; if the IPFS client fails (e.g. connection refused), the request will **fail**. We return a **503** or **500** with an error message (e.g. “IPFS not available” or “Upload failed”). The frontend can show this to the user. The document is not registered on-chain because we need the CID first; the user can retry when IPFS is back.

---

## 54. How does the user connect their wallet (e.g. MetaMask)? Which library (ethers.js)?

**Answer:** We use **ethers.js** (v6). The frontend checks for `window.ethereum` (injected by MetaMask). We create `new ethers.BrowserProvider(window.ethereum)` and call `provider.send("eth_requestAccounts", [])` to prompt the user to connect. We then get the signer with `provider.getSigner()` and use it for transactions. The contract instance is created with the signer so that registerDocument is sent from the user’s account.

---

## 55. What is MetaMask’s role? Does the frontend ever see the user’s private key?

**Answer:** MetaMask **holds** the user’s private key and **signs** transactions and messages when the user approves. The frontend **never** sees the private key. The frontend only gets the public address (from eth_requestAccounts) and sends transaction requests to MetaMask; the user approves in the MetaMask popup, and MetaMask signs and submits the transaction.

---

## 56. After the backend returns IPFS hash and document hash, what does the frontend do?

**Answer:** The frontend receives **ipfsHash** and **documentHash** from the backend. It then calls the smart contract: **contract.registerDocument(ipfsHash, documentHash, documentName)**. This triggers MetaMask to ask the user to confirm the transaction. After the user confirms, the transaction is sent; when it is mined, the document is registered on-chain. The frontend may show the transaction hash and success message.

---

## 57. Who signs the “register document” transaction—user or backend? Why?

**Answer:** The **user** (via MetaMask) signs the transaction. The backend does not have a wallet or private key. The user signs because (1) they are the **owner** of the document record on-chain (msg.sender), and (2) they pay gas. This keeps the system decentralized and ensures the registrant is the connected wallet.

---

## 58. For verification, why does the user upload the file again? What is computed from that file?

**Answer:** We need to **recompute the hash** of the document they claim to have. The user uploads the file so the backend can compute the **same SHA-256 hash** as at registration time. That hash is then used to query the contract. We do not trust the user to provide the hash—they provide the file, and we compute the hash to ensure it matches what was registered.

---

## 59. What are the main pages/screens (Upload, Verify, My Documents) and what does each do?

**Answer:** **Upload:** User selects a file and document name, submits to backend (IPFS + hash), then registers on-chain via MetaMask. **Verify:** User uploads a file; backend computes hash; frontend calls verifyDocument and shows whether the document is registered and displays owner, IPFS link, timestamp. **My Documents:** Lists all document hashes registered by the connected wallet, with names and IPFS links.

---

## 60. How does your system prevent someone from forging a certificate?

**Answer:** We cannot prevent someone from creating a *fake* PDF that looks like a certificate. We prevent **tampering** and **false claims of registration**: (1) Only a hash that was **registered on-chain** will verify. (2) The hash is tied to the **exact file content**; changing the file changes the hash, so verification fails. So forgery of a *new* document does not give a valid on-chain verification unless that exact hash was registered (e.g. by the real issuer).

---

*Prev: [viva-questions-2.md](viva-questions-2.md) · Next: [viva-questions-4.md](viva-questions-4.md) (Questions 61–80)*
