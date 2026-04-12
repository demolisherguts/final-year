# DocScan Viva – Blockchain & MetaMask (Extra Questions)

Additional questions on blockchain fundamentals, hashing, and MetaMask usage. Use alongside [viva-questions-1.md](viva-questions-1.md) through [viva-questions-6.md](viva-questions-6.md).

---

## 1. What is blockchain? What is it made of?

**Answer:** A **blockchain** is a **distributed ledger** that stores data in a chain of **blocks**. Each block typically contains: (1) **transactions** (e.g. transfers, smart contract calls), (2) a **timestamp**, (3) a **hash of the previous block** (forming the “chain”), and (4) often a **hash of the current block’s contents**. It is “made of” **cryptographic hashing** (e.g. SHA-256 in Bitcoin, Keccak-256 in Ethereum), **consensus rules**, and **network nodes** that maintain and validate the chain. No single party controls the data; changes require consensus.

---

## 2. What role do hashing algorithms play in blockchain?

**Answer:** **Hashing** is used in several ways: (1) **Block hash** – each block has a hash of its contents (transactions, previous block hash, nonce, etc.); changing any bit changes the hash, so tampering is detectable. (2) **Linking blocks** – the previous block’s hash is stored in the next block, so the chain is cryptographically linked. (3) **Addresses and keys** – public keys are hashed to get addresses. (4) **Data integrity** – in our project we hash the document (SHA-256) and store that hash on-chain so the document cannot be altered without the hash changing. Hashing gives **integrity** and **immutability**.

---

## 3. Which hashing algorithms are used in Bitcoin vs Ethereum?

**Answer:** **Bitcoin** uses **SHA-256** for block hashing (and in mining). **Ethereum** uses **Keccak-256** (often called SHA-3 in Ethereum docs) for block structure, transaction hashes, and address derivation. In **our DocScan project** we use **SHA-256** for the **document hash** (file content) because it is standard, fits in 32 bytes (bytes32), and is widely supported; the Ethereum chain itself still uses Keccak-256 for its internal data.

---

## 4. What is a block? What does a block contain?

**Answer:** A **block** is a **container** of data that gets appended to the chain. It usually contains: (1) **Block header** – block number, timestamp, previous block hash, current block hash (or nonce in PoW), Merkle root of transactions. (2) **List of transactions** – each transaction (e.g. “send ETH”, “call smart contract”) is included. (3) In proof-of-work (e.g. Bitcoin), a **nonce** that miners vary to get a hash below the difficulty target. Once a block is accepted by the network, it is part of the immutable history.

---

## 5. What is the “chain” in blockchain? How are blocks linked?

**Answer:** The **chain** is the **sequence of blocks** where each block stores the **hash of the previous block** in its header. So Block 2 contains hash(Block 1), Block 3 contains hash(Block 2), and so on. This creates a **cryptographic link**: changing any past block would change its hash, which would break the next block’s “previous hash” and all following blocks. So the whole history is tied together; to alter the past, an attacker would have to redo all later blocks and win consensus again, which is practically infeasible.

---

## 6. What is consensus? Why is it needed?

**Answer:** **Consensus** is the process by which **nodes in the network agree** on which blocks (and thus which transactions) are valid and in what order. Without consensus, everyone could have a different version of the ledger. Mechanisms include **Proof of Work (PoW)** (e.g. miners solve a puzzle), **Proof of Stake (PoS)** (e.g. validators stake ETH in Ethereum 2.0), or **Proof of Authority** in private chains. Consensus ensures that there is **one accepted history** and that no single party can unilaterally change it.

---

## 7. What is a node? What does a node do?

**Answer:** A **node** is a **participant** in the blockchain network that runs software (e.g. Geth for Ethereum) and maintains a copy of the chain. It **receives** new transactions and blocks, **validates** them (signatures, rules, state), and **propagates** them to other nodes. **Full nodes** store the full blockchain and can validate everything; **light nodes** rely on others for some data. When our frontend talks to “the blockchain,” it talks to a node (via RPC), e.g. MetaMask connects to a node (or a service like Infura that runs nodes).

---

## 8. What is MetaMask? What is it used for?

**Answer:** **MetaMask** is a **browser extension and mobile app** that acts as a **crypto wallet** and **bridge** between users and the blockchain. It: (1) **Stores** private keys and derives addresses (user never types the key on websites). (2) **Signs** transactions and messages when the user approves. (3) **Connects** to Ethereum (and other EVM chains) via RPC so dApps can request accounts and send transactions. In DocScan we use MetaMask so users can **connect their wallet**, **sign** the registerDocument transaction, and **pay gas** without the website ever seeing their private key.

---

## 9. How does MetaMask connect to a dApp (e.g. DocScan)?

**Answer:** When the user clicks “Connect Wallet,” our frontend uses **window.ethereum** (injected by MetaMask). We call **eth_requestAccounts** to ask the user to unlock and connect; MetaMask shows a popup. After approval, we get the user’s **address(es)**. We create an **ethers.BrowserProvider(window.ethereum)** and **getSigner()** to send transactions. When we call **contract.registerDocument(...)**, ethers.js builds a transaction; MetaMask pops up again for the user to **confirm** and **sign**; then MetaMask submits the transaction to the network (via its configured RPC). So the dApp never sees the private key—it only requests actions that the user approves in MetaMask.

---

## 10. What is a wallet? What does it store?

**Answer:** A **wallet** is software (or hardware) that **stores** or **has access to** your **private key(s)** and **derives** your **public key(s)** and **address(es)**. It does **not** store coins on the device—coins are on the blockchain; the wallet holds the **keys** that prove ownership. MetaMask stores (encrypted) **seed phrase / private keys** locally. From the seed it can derive many addresses. It also stores **network list** (mainnet, testnets, custom RPCs) and **transaction history** (often by querying the chain).

---

## 11. What is a private key? What is a public key? What is an address?

**Answer:** The **private key** is a **secret number** (256 bits in Ethereum) that you use to **sign** transactions and messages; whoever has it controls the account. The **public key** is **derived** from the private key (one-way); it is used to **verify** signatures. The **address** (e.g. 0x742d35Cc… in Ethereum) is **derived from the public key** (often last 20 bytes of Keccak-256 hash of the public key). We share our **address** to receive funds or interact with contracts; we **never** share the private key. In DocScan, the “owner” of a document is the **address** that signed the registerDocument transaction.

---

## 12. What is a seed phrase (recovery phrase)? Why is it important?

**Answer:** A **seed phrase** (e.g. 12 or 24 words) is a **human-readable backup** of the **master secret** from which the wallet derives all private keys. If you lose your device or reinstall MetaMask, you can **restore** the same keys (and thus same addresses and funds) by entering the seed phrase in a new wallet. **Whoever has the seed phrase has full control** of the account. So it must be kept secret and secure; losing it means losing access to the account forever (no “forgot password” on the blockchain).

---

## 13. What is a transaction? What does it contain?

**Answer:** A **transaction** is a **signed message** that tells the network to do something: e.g. send ETH, or call a smart contract function. In Ethereum it typically contains: **from** (sender address), **to** (contract or account), **value** (ETH to send), **data** (encoded contract call, e.g. registerDocument(...)), **gasLimit**, **maxFeePerGas** / **maxPriorityFeePerGas** (or legacy gasPrice), and **nonce**. The sender **signs** the transaction with their private key; nodes verify the signature and execute the transaction if valid.

---

## 14. What is gas? What is it used for?

**Answer:** **Gas** is the **unit of computational work** on Ethereum. Every operation (storage write, hash, contract call, etc.) costs a certain amount of gas. Users set a **gas price** (e.g. in gwei) and pay **gas used × gas price** in ETH. Gas **limits** misuse (e.g. infinite loops) and **rewards** miners/validators. In DocScan, **registerDocument** costs gas (storage, event); **verifyDocument** is a view call and typically does not cost the user gas when called from outside (it’s a read, not a transaction).

---

## 15. What is the nonce in a transaction? Why is it needed?

**Answer:** The **nonce** is a **per-account counter** of how many transactions that address has sent. Each new transaction must have nonce = previous nonce + 1. This (1) **orders** transactions from the same account, (2) **prevents replay**: the same signed transaction cannot be replayed on another network or again on the same network because the nonce would be wrong. The wallet (e.g. MetaMask) usually sets the nonce automatically when the user sends a transaction.

---

## 16. What is a smart contract? Where does it run?

**Answer:** A **smart contract** is **code** (e.g. written in Solidity) that is **deployed** to the blockchain as **bytecode** and has an **address**. It “runs” on **every full node** that processes blocks: when a transaction calls that contract, each node **executes** the contract code in the **EVM (Ethereum Virtual Machine)** and updates state. So the contract is **replicated** and **executed in a deterministic way** by all nodes; no single server runs it. Our DocumentRegistry contract runs on whatever network we deployed it to (e.g. Hardhat local, Sepolia).

---

## 17. What is the EVM (Ethereum Virtual Machine)?

**Answer:** The **EVM** is the **runtime environment** in which smart contract bytecode executes. Every Ethereum node runs the same EVM so that **execution is deterministic**: same inputs ⇒ same outputs and state changes. The EVM is **stack-based**, has opcodes for storage, hashing, calls, etc., and uses **gas** to meter execution. Solidity (and other languages) compile down to EVM bytecode that the nodes execute when a transaction targets a contract.

---

## 18. What is a testnet? Why use it instead of mainnet?

**Answer:** A **testnet** (e.g. Sepolia, Goerli) is a **separate blockchain** that works like Ethereum but uses **worthless test tokens**. Developers use it to **deploy and test** contracts and dApps without spending real ETH. In DocScan we can deploy to **Hardhat local** or **Sepolia** for testing; **mainnet** would be for real users and real value. Testnets often have **faucets** that give free test ETH for gas.

---

## 19. How do you add a custom network (e.g. Hardhat local) in MetaMask?

**Answer:** In MetaMask: **Settings → Networks → Add network** (or “Add a network manually”). Enter **Network name** (e.g. “Hardhat Local”), **RPC URL** (e.g. http://127.0.0.1:8545), **Chain ID** (e.g. 31337 for Hardhat), **Currency symbol** (e.g. ETH). Save. Then select this network in the dropdown so that transactions from DocScan go to your local node. For local testing you may need to **import** an account using a private key from Hardhat’s default accounts (from the Hardhat output or from a test script) to get test ETH.

---

## 20. What is the difference between signing a transaction and signing a message?

**Answer:** **Signing a transaction** creates a signed **transaction** (send ETH, call contract, etc.) that gets **broadcast to the network** and **changes state** (balance, contract storage). It costs **gas**. **Signing a message** (e.g. **personal_sign** or **signMessage** in MetaMask) signs an **arbitrary message** (e.g. “I am logging in”) for **authentication or proof**; it is **not** sent as a transaction and **does not** cost gas or change chain state. In DocScan we use **transaction signing** when the user registers a document (registerDocument is a state-changing call). Message signing could be used for login or proving ownership off-chain.

---

*See also: [viva-questions-1.md](viva-questions-1.md) – [viva-questions-6.md](viva-questions-6.md) for project and paper Q&A.*
