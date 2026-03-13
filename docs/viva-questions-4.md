# DocScan Viva Questions (61–80)

---

## 61. If an attacker has the same PDF as the original, can they “verify” it? Is that a problem?

**Answer:** Yes. Anyone who has the **exact same file** (same bytes) will get the **same hash** and will see it as “verified.” That is expected: the system proves “this file’s content was registered,” not “only the rightful owner can verify.” So if the document was shared or leaked, others can verify it too. For access control (who can *see* the document), you would need additional mechanisms (e.g. encryption, access policies), which are outside the current scope.

---

## 62. What if someone registers a hash without actually uploading the real document to IPFS?

**Answer:** The contract does **not** check whether the IPFS CID actually contains the document or matches the hash. So someone could register a random or wrong CID with a hash. **Verification** would still show “registered” for that hash, but when someone fetches the file from IPFS they might get wrong or empty content. To reduce this, the **issuer** (e.g. university) should be the one registering, and we could add an “Owner” role so only trusted entities can register. We could also add a check that the hash of the file at the CID matches the stored hash (done off-chain when retrieving).

---

## 63. How do you ensure the document on IPFS matches the hash stored on-chain?

**Answer:** **On registration:** We compute the hash from the **same file** we upload to IPFS, so by construction the hash matches the content at the CID. **On retrieval:** When someone fetches the file from IPFS, they can **recompute** the SHA-256 hash and compare it to the on-chain hash; if they match, the retrieved file is correct. The contract does not fetch from IPFS; integrity is ensured by the hash and by clients verifying after retrieval if needed.

---

## 64. Can someone alter a document after it is registered? What would happen during verification?

**Answer:** Yes, someone can **alter their local copy** of the document, but that altered file would have a **different hash**. When they (or anyone) run **verification** with the altered file, the backend would compute the new hash; that hash would **not** be found on-chain, so verification would **fail**. The on-chain record remains unchanged; only the original content’s hash verifies.

---

## 65. What are the trust assumptions (e.g. who do we trust: contract, IPFS, backend)?

**Answer:** We **trust**: (1) The **blockchain** and **smart contract** (immutability, correct code). (2) That the **hash** was computed correctly at registration (backend or client). We **partially trust**: (3) **IPFS** to store and return the correct content (we can verify by re-hashing after retrieval). (4) **Backend** not to tamper with the file before hashing or IPFS upload; running your own backend or auditing it reduces this. We do **not** trust any single party to change on-chain data—that requires the contract’s rules and user signatures.

---

## 66. Why is it important that the contract prevents duplicate registration of the same hash?

**Answer:** Preventing duplicates (1) avoids **redundant storage** and confusion about which record is “the” one. (2) Ensures **one document content → one on-chain record**, so verification is unambiguous. (3) Prevents **spam** or repeated registration of the same file. (4) Keeps the **owner** and **timestamp** unique and meaningful for the first registration.

---

## 67. What is the “research gap” you identified? (e.g. integrity vs authenticity of institutions.)

**Answer:** The gap is that many systems focus on **integrity of the credential** (hash, blockchain) but do not fully address **authenticity of the issuing institution**. So a non-accredited or fake institution could join the network and issue certificates that are cryptographically valid but not from a trusted source. Our proposed **Owner entity** that validates and onboards universities and companies is meant to fill this gap by curating who can participate.

---

## 68. How is your approach different from only using a blockchain ledger?

**Answer:** A **blockchain-only** approach would store either full documents (expensive, not scalable) or only hashes. We combine **blockchain (hashes + metadata)** with **IPFS (actual file storage)** so we get **immutability and verifiability** on-chain and **cheap, scalable storage** off-chain. We also designed for a **three-sided** flow (students, universities, employers) and proposed governance (Owner) for institutional trust.

---

## 69. How is it different from only using IPFS?

**Answer:** **IPFS alone** gives decentralized storage and content addressing but **no global, tamper-proof proof** that a specific hash was officially registered at a given time by a given entity. By adding the **blockchain**, we get a **single source of truth** for “this hash was registered by this address at this time,” which enables trustless verification without relying on a central database.

---

## 70. What are “blockchain-based ledgers” in the context of credentials (from your literature review)?

**Answer:** They are systems that use a **blockchain as an immutable ledger** to record credential-related transactions (e.g. issuance, verification). Various studies use platforms like Ethereum to provide **immutability, traceability, and transparency** and to automate issuance and verification. A limitation mentioned in the synopsis is **scalability** when large data is stored on-chain, which we address by keeping only hashes on-chain and using IPFS for files.

---

## 71. What are “integrated DApps” for verification? Give an example if you cited one.

**Answer:** **Integrated DApps** are decentralized applications that bring **all stakeholders** (students, universities, employers) into a **single verification framework**, handling issuance, validation, and sometimes incentives. The synopsis mentions **SkillCheck** as an example that uses tools like Ganache and Truffle for trustless credential exchange. Our DocScan is also an integrated DApp with a React frontend, backend, and smart contract.

---

## 72. Why do existing systems fail to assure “authenticity of entities” that issue credentials?

**Answer:** Many systems focus on **document integrity** (hash, signature) but not on **who is allowed to issue**. So any address can deploy or use the contract and “issue” credentials. Without a **curated list** of trusted issuers (e.g. accredited universities), malicious or fake institutions can issue credentials that are **cryptographically valid** but not from a recognized body. Our proposed Owner/curator role is meant to address this.

---

## 73. How does your “Owner” / institutional authentication idea address this gap? (If not implemented, explain as proposed extension.)

**Answer:** The **Owner** (or admin) would **validate and onboard** only legitimate universities and companies. For example, only addresses in an “approved issuers” list could call registerDocument, or only they could register on behalf of students. This adds a **governance layer** so that “registered on-chain” also implies “issued by an approved institution.” In the current code we have a single contractOwner; the full access control (e.g. mapping of approved issuers) can be added as an extension.

---

## 74. What methodology did you follow (e.g. design science, iterative)?

**Answer:** The synopsis describes a **design science** approach: **problem identification** (literature review, limitations of current verification), **solution design** (blockchain + IPFS, two-tier design), and **evaluation** (prototype, testing of robustness, security, efficiency, usability). It is **iterative**: design → build → test → refine, so the solution is both theoretically grounded and practically validated.

---

## 75. What “quantitative” metrics did you plan (gas, latency, throughput)? Did you measure them?

**Answer:** The synopsis mentions **quantitative analysis** of: **gas consumption** for uploadDocument and verifyDocument, **transaction latency**, **throughput**, and **response time** to assess scalability and deployment efficiency. To make the thesis/publication complete, you would **run** the contract (e.g. on Hardhat or testnet), record gas used per registerDocument and verifyDocument, measure end-to-end latency (upload → IPFS → tx confirmed), and optionally throughput (documents per second). These can be added to the report as a “Results” or “Evaluation” section.

---

## 76. How would you evaluate “effectiveness in eliminating credential fraud”?

**Answer:** (1) **Technically:** Show that any change to the document changes the hash and causes verification to fail (tamper detection). (2) **Operationally:** Argue that once institutions register only genuine certificates, unregistered forgeries have no on-chain proof. (3) **Empirically:** Simulate scenarios (e.g. forged PDF, modified PDF) and show verification fails; optionally survey or interview stakeholders on perceived trust and efficiency.

---

## 77. What is “simulated data” in your project? Why use it instead of real certificates?

**Answer:** **Simulated data** means **mock certificates and transcripts** (synthetic or anonymized) used for testing. We use it to (1) **preserve privacy** (no real student or institution data), (2) **test edge cases** (e.g. duplicates, invalid files) without legal/ethical issues, and (3) **reproduce** experiments. For a real deployment, institutions would register real certificates; for development and evaluation, simulated data is sufficient and safer.

---

## 78. How did you test the smart contract (e.g. unit tests with Hardhat)?

**Answer:** We use **Hardhat** with **JavaScript/Chai** tests. Tests cover: deployment and contract owner; successful registration and verification (hash, owner, timestamp, name); rejection of duplicate registration; rejection of empty ipfsHash; and listing documents by owner (getDocumentCountByOwner, getDocumentHashByOwnerIndex). Run with `npx hardhat test`.

---

## 79. What is Hardhat? What is it used for (compile, test, deploy)?

**Answer:** **Hardhat** is a development environment for Ethereum: **compile** Solidity (hardhat compile), **run tests** (hardhat test), **run a local node** (hardhat node), and **run scripts** like deploy (hardhat run scripts/deploy.js). It provides a local blockchain, console logging, and integration with ethers.js. We use it for the full contract lifecycle during development.

---

## 80. What is Ganache / local node? When do you use it?

**Answer:** **Ganache** (from Truffle) or **Hardhat node** provides a **local Ethereum blockchain** for development. You use it to deploy contracts and test the frontend without spending real ether or waiting for testnet. In our setup we use **Hardhat node** (`npx hardhat node`); then we deploy with `--network localhost` and point MetaMask to that chain (e.g. RPC http://127.0.0.1:8545, chain ID 31337) to test the full flow.

---

*Prev: [viva-questions-3.md](viva-questions-3.md) · Next: [viva-questions-5.md](viva-questions-5.md) (Questions 81–100)*
