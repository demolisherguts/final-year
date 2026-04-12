# DocScan Viva Questions (81–100)

---

## 81. Which SDG does your project primarily align with? (SDG 4 – Quality Education.)

**Answer:** The project primarily aligns with **SDG 4: Quality Education**, especially **Target 4.3** (equal access to affordable, quality technical, vocational, and tertiary education). By making credentials verifiable and reducing fraud, we help safeguard the value of educational achievements and support fair recognition of qualifications, contributing to a more trustworthy education ecosystem.

---

## 82. How does your project support “quality education” or “equal access”?

**Answer:** It supports **quality education** by ensuring that credentials are **authentic and tamper-proof**, so achievements are recognized fairly. It supports **equal access** indirectly: a transparent, low-friction verification system reduces barriers (cost, delay) for students and institutions and helps employers trust qualifications regardless of where they were issued, which can benefit underrepresented or distant learners.

---

## 83. How does it support SDG 8 (Decent Work)?

**Answer:** **SDG 8** is about decent work and economic growth. Our project supports it by enabling **faster, more reliable credential verification**, which reduces hiring delays and helps employers make confident hiring decisions. This can help qualified candidates get jobs more quickly and supports productivity and economic growth through a more efficient labor market.

---

## 84. How does it support SDG 9 (Industry, Innovation, Infrastructure)?

**Answer:** **SDG 9** concerns industry, innovation, and infrastructure. We use **blockchain and IPFS** to build **resilient, scalable** infrastructure for credential management. The project demonstrates how decentralized technologies can **modernize** legacy verification systems and serves as an example of **innovation** in digital infrastructure for education and employment.

---

## 85. How does it support SDG 16 (Peace, Justice, Strong Institutions)?

**Answer:** **SDG 16** is about peace, justice, and strong institutions. A **transparent, immutable** verification system reduces **corruption and fraud** in credentials, strengthens **accountability** of institutions, and provides an **audit trail**. This builds public trust in educational and employer institutions and supports **just and transparent governance** in the credentialing space.

---

## 86. What is the impact on “material order” (e.g. less paper, less printing)?

**Answer:** Moving from **paper-based** to **digital, decentralized** verification reduces the need for **physical certificates**, **printing**, **shipping**, and **storage**. This lowers use of paper, energy, and materials. The synopsis states that even accounting for energy used by digital infrastructure, the elimination of repetitive manual verification and physical handling reduces overall resource use.

---

## 87. What is the impact on “human order” (trust, fairness, recognition)?

**Answer:** The system supports **trust** (verifiable, tamper-proof records), **fairness** (everyone’s credentials can be checked the same way), and **recognition** (genuine achievements are provable). It gives people **control** over their verifiable digital records and reduces tension and wasted effort from fraud and manual checks, strengthening social institutions that rely on fairness and accountability.

---

## 88. What do you mean by “harmony with nature” in your synopsis?

**Answer:** “Harmony with nature” in the synopsis refers to reducing the **environmental footprint** of verification: less paper, less deforestation, less energy for printing and transport. By shifting to a digital, efficient system, the project aims to align human needs (trust, verification) with **lower impact** on natural resources and ecosystems, in line with the “Universal Human Values” framing in the document.

---

## 89. What is in scope and what is out of scope in your project?

**Answer:** **In scope:** Design and development of a **blockchain-based DApp** for management and verification of academic documents; Ethereum for hashes; IPFS for storage; user interface for students, universities, and employers. **Out of scope:** Digitizing **historical physical records**; **integrating legacy university systems** (ERP, etc.); production deployment at scale or legal compliance (e.g. e-signature laws) unless explicitly added.

---

## 90. Do you digitize old physical certificates or only new digital ones?

**Answer:** The project **does not** include digitizing **historical physical records**. The focus is on a **framework for issuing and verifying digital certificates** going forward. Old certificates would require a separate process (e.g. scanning, verification by institution, then registration on our system) if we were to extend the scope later.

---

## 91. Do you integrate with existing university ERP systems? (If no, say so and why.)

**Answer:** **No.** The scope explicitly **excludes** integration with legacy university systems. Integration would require APIs, authentication, and policy alignment with each institution’s ERP. The project delivers a **standalone** verification platform; integration can be a **future work** or institutional project.

---

## 92. What are the limitations of your current system?

**Answer:** Limitations include: (1) **Wallet dependency**—users need MetaMask and gas to register. (2) **IPFS availability**—documents depend on pinning and network. (3) **No revocation**—we do not yet support revoking or updating a registered document. (4) **No institutional access control**—anyone can register; the “Owner” curator is proposed but not fully implemented. (5) **Privacy**—documents on IPFS may be publicly accessible if CIDs are shared.

---

## 93. What if the user loses access to their wallet? Can they still “own” their documents?

**Answer:** The **on-chain record** ties ownership to the **address** that registered. If the user loses the wallet (e.g. loses private key), they **cannot** sign from that address again; the records still exist on-chain but are effectively “orphaned” from their control. Recovery would require wallet backup/recovery (e.g. seed phrase) or institutional policies (e.g. university re-issuing and re-registering). The system does not implement recovery or key escrow.

---

## 94. What about privacy—is the document content public on IPFS?

**Answer:** By default, **content on IPFS** can be accessed by anyone who has the **CID**. So if the CID is shared or leaked, the document can be fetched. For **privacy-sensitive** certificates, we could (1) **encrypt** the file before uploading to IPFS and share the key only with verifiers, or (2) use **private IPFS** or access-controlled storage. The current implementation does not include encryption; it is a known limitation.

---

## 95. How would you add the “Owner” role to onboard/validate universities and companies?

**Answer:** We could: (1) Add a mapping `approvedIssuers[address]` and only allow those addresses to call `registerDocument` (or a new `registerDocumentOnBehalfOf`). (2) Let the **contract owner** (or multi-sig) call `setApprovedIssuer(address, bool)`. (3) Optionally, separate roles: “Owner” (admin) and “Issuer” (university/company). (4) Emit events when issuers are added/removed for transparency. This implements the “curated trust network” from the synopsis.

---

## 96. What would you do in Phase 2 or future work (e.g. QR codes, mobile app, other chains)?

**Answer:** **Future work** could include: (1) **QR codes** on physical certificates linking to the verification page (as in the objectives). (2) **Mobile app** (React Native or similar) for easier scanning and verification. (3) **Revocation/update** of credentials (e.g. degree cancelled). (4) **Encryption** for private documents on IPFS. (5) **Multi-chain** or layer-2 for lower gas. (6) **Full Owner/issuer** access control and institutional onboarding.

---

## 97. What is bytes32? Why is the document hash stored as bytes32?

**Answer:** **bytes32** is a Solidity type for **exactly 32 bytes** (256 bits). SHA-256 produces a 256-bit hash, so it fits exactly in bytes32. Storing as bytes32 is **efficient** (fixed size), allows use as a **mapping key** (e.g. documentsByHash[documentHash]), and matches the standard representation of hashes in Ethereum (e.g. 0x followed by 64 hex characters).

---

## 98. What is the difference between storage, memory, and calldata in Solidity (if you used them)?

**Answer:** **storage** = persistent contract state (e.g. mappings, state variables); lives on-chain and costs more gas. **memory** = temporary, within a function; cleared after the call; used for local variables and reference types (e.g. strings returned from a function). **calldata** = read-only data passed in the transaction; used for external function parameters (e.g. string calldata ipfsHash) and is gas-efficient for read-only inputs.

---

## 99. What is the difference between Ethers.js and Web3.js? Which did you use and why?

**Answer:** Both are **libraries to interact with Ethereum** from JavaScript. **Web3.js** is older and callback/Promise based. **Ethers.js** has a cleaner API, good TypeScript support, and is well maintained; it is often preferred for new projects. We used **ethers.js (v6)** in the frontend for wallet connection (BrowserProvider), contract calls, and transaction handling, as specified in the synopsis.

---

## 100. What is an ABI? Where do you use it in the frontend?

**Answer:** The **ABI (Application Binary Interface)** is a JSON description of a contract’s **functions, events, and parameters**. It tells the frontend how to encode calls and decode results. We use it when creating the contract instance: `new ethers.Contract(contractAddress, DOCUMENT_REGISTRY_ABI, signer)`. We defined a minimal ABI in the frontend (e.g. in `contracts/abi.js`) with the function signatures we call (registerDocument, verifyDocument, getDocumentCountByOwner, getDocumentHashByOwnerIndex).

---

*Prev: [viva-questions-4.md](viva-questions-4.md) · Next: [viva-questions-6.md](viva-questions-6.md) (Questions 101–120)*
