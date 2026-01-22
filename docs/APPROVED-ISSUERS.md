# Approved Issuers – Verified Institutions Only

Only **approved issuers** (verified universities, companies, government bodies) can **register** documents. Anyone can **verify** a document.

---

## Why

So that only **trusted** entities can add documents to the system. Students or random users cannot register fake certificates; only institutions that the contract owner has approved can do so.

---

## How it works

1. **Contract owner** (the address that deployed the contract) can add or remove approved issuers.
2. **Approved issuers** are the only addresses that can call `registerDocument(...)`.
3. **Anyone** can call `verifyDocument(...)` (read-only) to check if a document is registered.

---

## For local / demo

- The **deployer** (the account that runs `deploy`) is automatically an **approved issuer**.
- So when you run `./start-all.sh`, the Hardhat account that deploys the contract can register documents. Use that account (Account #0) in MetaMask to upload.

---

## Adding a new approved issuer (production)

The **contract owner** calls:

```solidity
setApprovedIssuer(address issuer, bool approved)
```

- `issuer` = wallet address of the university, company, or government body.
- `approved` = `true` to allow them to register, `false` to revoke.

So in practice:

1. University / company gets a wallet (e.g. MetaMask or custody).
2. Contract owner (e.g. government or DocScan admin) calls `setApprovedIssuer(universityAddress, true)` in a transaction.
3. That address can then register documents from the Upload page.

---

## Frontend

- **Upload** page checks `isApprovedIssuer(your address)`.
- If **not approved**: the form shows a message and the register button is disabled. You can still use **Verify**.
- If **approved**: you can register as before.

---

## Summary

| Role | Can register? | Can verify? |
|------|----------------|-------------|
| Contract owner | Yes (and can add/remove issuers) | Yes |
| Approved issuer (university, company, gov) | Yes | Yes |
| Anyone else (e.g. student) | No | Yes |

Documents are therefore only uploaded by **verified** institutions; verification remains open to everyone.
