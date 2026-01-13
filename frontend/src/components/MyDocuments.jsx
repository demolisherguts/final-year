import React, { useState, useEffect } from "react";
import CopyBtn from "./CopyBtn";

export default function MyDocuments({ contract, address, chainId }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!contract || !address) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const count = await contract.getDocumentCountByOwner(address);
        const list = [];
        for (let i = 0; i < Number(count); i++) {
          const hash = await contract.getDocumentHashByOwnerIndex(address, i);
          const [exists, ipfsHash, owner, timestamp, documentName] = await contract.verifyDocument(hash);
          if (exists) {
            list.push({
              documentHash: hash,
              ipfsHash,
              owner,
              timestamp: Number(timestamp),
              documentName,
            });
          }
        }
        if (!cancelled) setDocs(list);
      } catch (err) {
        if (!cancelled) {
          const msg = err.message || "";
          if (msg.includes("BAD_DATA") || msg.includes("could not decode") || msg.includes("value=\"0x\"")) {
            const wrongNetwork = chainId != null && Number(chainId) !== 31337;
            setError(
              wrongNetwork
                ? `Wrong network. You're on Chain ID ${chainId}. Switch MetaMask to Hardhat Local: RPC http://127.0.0.1:8545, Chain ID 31337. (Run ./start-all.sh first so the contract is deployed.)`
                : "Could not read from contract. Use Hardhat Local: RPC http://127.0.0.1:8545, Chain ID 31337. Run ./start-all.sh to deploy and start everything, then switch MetaMask to that network."
            );
          } else {
            setError(msg || "Failed to load documents");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [contract, address, chainId]);

  if (loading) return <div className="card">Loading your documents…</div>;
  if (error) return <div className="message error">{error}</div>;

  return (
    <section className="card">
      <h2>My Documents</h2>
      <p className="muted" style={{ marginBottom: "1rem" }}>
        Documents you have registered on the blockchain.
      </p>
      {docs.length === 0 ? (
        <p className="muted">No documents registered yet. Upload one from the Upload page.</p>
      ) : (
        <ul className="doc-list">
          {docs.map((d, i) => (
            <li key={i} className="doc-item">
              <strong>{d.documentName}</strong>
              <div className="doc-meta">
                <div className="data-row">
                  <span>Hash:</span> <code>{d.documentHash.slice(0, 18)}…</code> <CopyBtn text={d.documentHash} />
                </div>
                <div className="data-row">
                  <span>IPFS:</span> <a href={`https://ipfs.io/ipfs/${d.ipfsHash}`} target="_blank" rel="noopener noreferrer">{d.ipfsHash}</a> <CopyBtn text={d.ipfsHash} />
                </div>
                <div className="data-row">
                  <span>Registered:</span> {new Date(d.timestamp * 1000).toLocaleString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
