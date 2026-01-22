# DocScan Viva Questions (1–20)

---

## 1. What exact problem does your project solve?

**Answer:** The project solves the problem of **insecure, manual, and non-interoperable verification of academic documents**. Today, students repeatedly submit physical certificates to universities and employers; the process is slow, prone to forgery, and lacks a single trusted source of truth. DocScan provides a decentralized, tamper-proof way to register and verify academic credentials using blockchain (for integrity) and IPFS (for storage).

---

## 2. Why is manual/academic document verification a problem today?

**Answer:** Manual verification is **time-consuming**, **inefficient**, and **insecure**. Students must send physical or scanned copies; institutions must contact issuing universities; there is no standard way to check authenticity. The process creates delays, administrative burden, and risk of accepting forged credentials. It also does not scale when many parties need to verify the same document.

---

## 3. What are the drawbacks of current (centralized) verification systems?

**Answer:** Centralized systems have **single points of failure**, **poor interoperability** between institutions, and **higher vulnerability to forgery or insider tampering**. Data is controlled by one authority; if that system is compromised or unavailable, verification fails. There is also less transparency—users cannot independently verify that a record has not been altered.

---

## 4. Who are the main stakeholders and what do they lose in the current system?

**Answer:** The main stakeholders are **students**, **universities**, and **employers**. Students lose time and face the risk of losing or damaging physical documents. Universities bear the cost of repeated verification requests and record-keeping. Employers face delays in hiring and the risk of hiring candidates with fraudulent credentials. All lose trust when the system is fragmented and opaque.

---

## 5. What is “credential fraud” in your context, and how does your system address it?

**Answer:** Credential fraud means **forged or altered academic certificates or transcripts**—e.g. fake degrees or modified grades. DocScan addresses it by storing a **cryptographic hash** of each document on the blockchain. Any change to the document changes the hash, so verification fails if the document has been tampered with. The hash is immutable once registered.

---

## 6. Why did you choose academic documents and not other types of documents?

**Answer:** Academic documents are **high-stakes** (admissions, jobs, promotions), **frequently verified**, and **currently handled in a fragmented way**. The synopsis focuses on this domain to show a clear use case. The same design (hash on-chain, file on IPFS) could later be extended to other document types (e.g. land records, medical reports).

---

## 7. What is the “consequence of a flawed system” you mention in the synopsis?

**Answer:** The consequences include **rise of counterfeit degrees**, **delays and cost** for employers and institutions, **loss of trust** in qualifications, and **burden on students** who must store and repeatedly present physical documents. The absence of a secure, unified verification system undermines the credibility of the entire academic and hiring ecosystem.

---

## 8. How does your solution reduce administrative overhead?

**Answer:** Verification becomes **automated and instant**. Instead of institutions contacting each other or manually checking papers, anyone can upload the document (or its hash), and the system checks the blockchain in a read-only way. No phone calls, emails, or physical mail are needed. This reduces repeated requests to universities and speeds up hiring and admissions.

---

## 9. What is blockchain? Explain in simple terms.

**Answer:** A **blockchain** is a distributed ledger that stores data in linked “blocks.” Once data is written, it is very hard to change without consensus. Many nodes keep a copy, so there is no single point of control. In DocScan, we use it to store document hashes so that once a certificate is registered, the proof of its integrity cannot be altered.

---

## 10. What do we mean by “immutability” in blockchain? How does it help document verification?

**Answer:** **Immutability** means that past records are **not editable** in practice—changing history would require changing many blocks and breaking consensus. For document verification, this means the hash we store for a certificate cannot be tampered with. Anyone can trust that the stored hash is the one that was originally registered.

---

## 11. What is a smart contract? How is it different from a normal program?

**Answer:** A **smart contract** is code that runs on a blockchain. It is **deployed once** and then invoked by users; its logic and state are **shared and transparent**. Unlike a normal server program, no single party can change the code or the stored data without going through the contract’s rules and the network’s consensus.

---

## 12. Why use Ethereum (or a blockchain) instead of a normal database?

**Answer:** A **normal database** can be changed by whoever controls it. A **blockchain** gives **immutability**, **transparency**, and **decentralized trust**. For credentials, we want anyone to be able to verify that a hash was registered without relying on one company or server. Ethereum also allows programmable logic (smart contracts) for rules like “one hash per document.”

---

## 13. What is gas? Why does storing only the hash on-chain and not the full document matter?

**Answer:** **Gas** is the fee paid to execute transactions on Ethereum; more computation and storage mean more gas. Storing a **hash (32 bytes)** is cheap; storing **full PDFs** would be very expensive and would bloat the chain. So we store only the hash on-chain for integrity and keep the actual document on IPFS, which is built for large files.

---

## 14. What is a transaction? What is a block?

**Answer:** A **transaction** is a signed request to do something (e.g. call a smart contract function like `registerDocument`). A **block** is a batch of transactions validated by the network and appended to the chain. Each block is linked to the previous one, forming the blockchain. Our “register document” action is one transaction that gets included in a block.

---

## 15. What is a wallet (e.g. MetaMask) and what role does it play in your system?

**Answer:** A **wallet** holds the user’s **address** and **private key** and lets them sign transactions without exposing the key. In DocScan, MetaMask is used to **connect** the user’s identity (address) to the app, **sign** the `registerDocument` transaction so the user is recorded as owner, and **pay gas** for that transaction. The frontend never sees the private key.

---

## 16. What is the difference between on-chain and off-chain data? Why do you use both?

**Answer:** **On-chain** data lives on the blockchain (e.g. document hash, IPFS CID, owner, timestamp)—it is immutable and publicly verifiable. **Off-chain** data lives elsewhere (e.g. the actual PDF on IPFS). We use both because the chain gives **trust and proof**, while off-chain storage gives **scalability and cost efficiency** for large files.

---

## 17. What is IPFS? Full form and basic idea.

**Answer:** **IPFS** stands for **InterPlanetary File System**. It is a **distributed, content-addressed** storage network. Files are identified by their **content** (via a hash/CID), not by a server URL. Many nodes can store and serve the same content, so it is resilient and decentralized. We use it to store the actual certificate files.

---

## 18. Why store documents on IPFS instead of on the blockchain?

**Answer:** Storing full documents on the blockchain would be **very expensive** (gas) and would **bloat the chain**. IPFS is designed for **large files**, is **cheaper**, and still gives us a **content identifier (CID)**. We store only the CID and the document hash on-chain, so we get both **integrity** (hash) and **retrieval** (CID) without putting the file on-chain.

---

## 19. What is a CID (Content Identifier)? How is it different from a URL?

**Answer:** A **CID** is a **content-addressed** identifier: it is derived from the *content* of the file. The same file always gets the same CID. A **URL** is **location-addressed**: it points to a server and path. If the server moves or changes the file, the URL can break or show different content. With a CID, you always get the same content no matter which node serves it.

---

## 20. What happens if an IPFS node that has my document goes offline? Is the document lost?

**Answer:** It depends. If **only one node** had the content and it goes offline, the content can be **temporarily unavailable** until someone else pins or fetches it. In practice we **pin** important content (e.g. via our backend or a pinning service) so multiple nodes hold it. For production, using a pinning service (e.g. Pinata, Infura) improves availability.

---

*Next: [viva-questions-2.md](viva-questions-2.md) (Questions 21–40)*
