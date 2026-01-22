# DocScan Viva – Very Basic Questions (Asked First)

Simple, foundational questions examiners often ask first. Short and easy-to-remember answers.

---

## 1. What is blockchain?

**Answer:** Blockchain is a **digital ledger** (record book) that is **shared across many computers**. Once data is written, it is very hard to change. So it is good for keeping records that everyone can trust.

---

## 2. What is a block?

**Answer:** A **block** is like **one page** of the ledger. It holds a list of **transactions** (e.g. someone sent money, or someone registered a document). Many blocks are linked one after another to form the **chain**.

---

## 3. What is hashing?

**Answer:** **Hashing** means taking **any data** (a file, text, etc.) and turning it into a **fixed-length code** (the hash). Same input always gives the same hash. If you change even one letter or one bit, the hash changes completely. We use it to **check if data was changed**.

---

## 4. What is SHA-256?

**Answer:** **SHA-256** is a **hashing algorithm**. It takes any input and gives a **256-bit** (32-byte) output. It is used everywhere for security. In our project we use SHA-256 to hash the **document file** so we can store a short fingerprint on the blockchain instead of the whole file.

---

## 5. What is a smart contract?

**Answer:** A **smart contract** is **program code** that runs on the blockchain. It does what it is programmed to do (e.g. “store this hash,” “check if this hash exists”) and **no one can change** that code once it is deployed. In our project the smart contract stores and verifies document hashes.

---

## 6. What is Ethereum?

**Answer:** **Ethereum** is a **blockchain platform** that supports **smart contracts**. So besides moving money, we can run programs (contracts) on it. Our DocScan contract runs on Ethereum (or a test network that works like Ethereum).

---

## 7. What is IPFS?

**Answer:** **IPFS** means **InterPlanetary File System**. It is a **decentralized way to store files**. Instead of one server, many computers can hold the file. Each file gets a unique ID based on its **content** (content-addressable). We use IPFS to store the **actual certificate file**; only the **hash** and **file ID** go on the blockchain.

---

## 8. What is a wallet?

**Answer:** A **wallet** is an app or device that **holds your keys** to your blockchain account. It does not “store” coins inside it—the coins are on the blockchain. The wallet lets you **sign** transactions so you can send money or call smart contracts. **MetaMask** is a wallet.

---

## 9. What is MetaMask?

**Answer:** **MetaMask** is a **browser extension** (and mobile app) that works as a **crypto wallet**. It keeps your **private key** safe and lets you **connect** to websites (like DocScan), **approve** transactions, and **pay fees** (gas) without giving the website your key.

---

## 10. What is gas?

**Answer:** **Gas** is the **fee** you pay to do something on the blockchain (e.g. register a document). Every action costs a little “gas”; someone has to run the computers that process it, so you pay in the network’s coin (e.g. ETH). More complex actions cost more gas.

---

## 11. What is a transaction?

**Answer:** A **transaction** is a **request** you send to the blockchain, like “send 1 ETH to this address” or “call this smart contract function.” You **sign** it with your wallet; then it is broadcast to the network and, if valid, is written into a block.

---

## 12. What is a private key?

**Answer:** The **private key** is a **secret** (a long number) that **proves you own** your account. Whoever has it can sign transactions and control the account. You must **never share** it. The wallet stores it for you.

---

## 13. What is an address?

**Answer:** An **address** is like your **account number** on the blockchain (e.g. 0x742d35Cc…). You share it to **receive** money or to show “this is my account.” It is **derived from** your public key. In DocScan, the **owner** of a document is the address that registered it.

---

## 14. What is decentralization?

**Answer:** **Decentralization** means **no single company or server** is in control. Many computers (nodes) keep a copy of the data and the rules. So no one can change the records alone. In DocScan, the **proof** of a document (the hash) is decentralized on the blockchain.

---

## 15. What is immutability?

**Answer:** **Immutability** means **cannot be changed**. Once data is written on the blockchain, it is practically impossible to edit or delete it. So we can trust that the document hash we stored will stay as it is.

---

## 16. What is verification (in our project)?

**Answer:** **Verification** means **checking if a document is real and not tampered**. The user uploads the file; we compute its hash and **ask the blockchain** if that hash was ever registered. If yes, the document is **verified**. If no, it is not in our system.

---

## 17. What is the difference between on-chain and off-chain?

**Answer:** **On-chain** = data stored **on the blockchain** (e.g. document hash, owner, time). **Off-chain** = data stored **elsewhere** (e.g. the actual PDF on IPFS). We keep only **small, important proof** on-chain and the **big file** off-chain to save cost and space.

---

## 18. Why do we store only the hash on the blockchain and not the full document?

**Answer:** Because storing the **full document** on the blockchain would be **very expensive** (lots of gas) and would make the chain too big. The **hash** is small (32 bytes) and is enough to **prove** the document’s content. The actual file stays on **IPFS**.

---

## 19. What is DocScan?

**Answer:** **DocScan** is our **project name**. It is a system where students or institutions can **upload** academic documents; the file goes to **IPFS** and its **hash** is saved on the **blockchain**. Anyone can **verify** a document by uploading it—we check if its hash exists on the chain.

---

## 20. What problem does DocScan solve?

**Answer:** DocScan solves the problem of **slow, manual, and unsafe** verification of academic certificates. Instead of sending papers and waiting for phone calls, we use the **blockchain** to prove that a document is **real and unchanged**, and **IPFS** to store the file. Verification becomes **fast and tamper-proof**.

---

*Next level: [viva-questions-blockchain-metamask.md](viva-questions-blockchain-metamask.md) (more detail on blockchain & MetaMask).*  
*Full project Q&A: [viva-questions-1.md](viva-questions-1.md) onwards.*
