import React, { useState } from "react";
import { ethers } from "ethers";
import CopyBtn from "./CopyBtn";

export default function Verify({ contract, apiBase }) {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0]);
    setResult(null);
    setError("");
  };

  /** Normalize to bytes32 hex string (0x + 64 hex chars) for contract call */
  function toBytes32Hex(h) {
    if (!h || typeof h !== "string") return null;
    const hex = h.startsWith("0x") ? h.slice(2) : h;
    if (!/^[0-9a-fA-F]{64}$/.test(hex)) return null;
    return "0x" + hex.toLowerCase().padStart(64, "0").slice(0, 64);
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Select a file to verify.");
      return;
    }
    if (!contract) {
      setError("Contract not configured. Set VITE_CONTRACT_ADDRESS.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const formData = new FormData();
      formData.append("document", file);
      const res = await fetch(`${apiBase || ""}/api/hash`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Hash computation failed");

      const documentHash = toBytes32Hex(data.documentHash);
      if (!documentHash) {
        setError("Invalid hash from server.");
        return;
      }
      const [exists, ipfsHash, owner, timestamp, documentName] = await contract.verifyDocument.staticCall(documentHash);

      setResult({
        exists,
        documentHash,
        ipfsHash: exists ? ipfsHash : null,
        owner: exists ? owner : null,
        timestamp: exists ? Number(timestamp) : null,
        documentName: exists ? documentName : null,
      });
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("BAD_DATA") || msg.includes("could not decode") || msg.includes("value=\"0x\"")) {
        setError(
          "Could not read from the blockchain. Use the same network you used when registering: switch MetaMask to Sepolia (11155111) or Hardhat Local (31337) and try again."
        );
      } else {
        setError(msg || "Verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h2>Verify Document</h2>
      <p className="muted" style={{ marginBottom: "1rem" }}>
        Upload the same file; we compute its hash and check the blockchain.
      </p>
      <form onSubmit={handleVerify}>
        <div className="form-group">
          <label>Document file</label>
          <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading || !file}>
          {loading ? "Verifying…" : "Verify on Chain"}
        </button>
      </form>
      {error && <div className="message error" style={{ marginTop: "1rem" }}>{error}</div>}
      {result && (
        <div className={`message ${result.exists ? "success" : "error"}`} style={{ marginTop: "1rem" }}>
          {result.exists ? (
            <>
              <div className="verified-badge">✓ Verified</div>
              <p style={{ margin: "0 0 0.75rem 0" }}>This document is registered on-chain.</p>
              <div className="success-detail">
                <div className="data-row">
                  <span>Name:</span> {result.documentName}
                </div>
                <div className="data-row">
                  <span>Owner:</span> <code>{result.owner}</code> <CopyBtn text={result.owner} />
                </div>
                <div className="data-row">
                  <span>IPFS:</span> <a href={`https://ipfs.io/ipfs/${result.ipfsHash}`} target="_blank" rel="noopener noreferrer">{result.ipfsHash}</a> <CopyBtn text={result.ipfsHash} />
                </div>
                <div className="data-row">
                  <span>Hash:</span> <code style={{ fontSize: "0.8rem" }}>{result.documentHash.slice(0, 20)}…</code> <CopyBtn text={result.documentHash} />
                </div>
                <div className="data-row">
                  <span>Registered:</span> {result.timestamp ? new Date(result.timestamp * 1000).toLocaleString() : "—"}
                </div>
              </div>
            </>
          ) : (
            "This document is not registered. Hash not found on-chain."
          )}
        </div>
      )}
    </section>
  );
}
