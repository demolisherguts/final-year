import React, { useState } from "react";

// Hardhat Account #0 – pre-filled for local demo
const DEFAULT_ISSUER = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

export default function Admin({ contract, readContract, address }) {
  const [issuerAddress, setIssuerAddress] = useState(DEFAULT_ISSUER);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [checkResult, setCheckResult] = useState(null);

  const handleApprove = async (e) => {
    e.preventDefault();
    if (!contract || !issuerAddress.trim()) return;
    const addr = issuerAddress.trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) {
      setStatus({ type: "error", text: "Enter a valid Ethereum address (0x...)." });
      return;
    }
    setLoading(true);
    setStatus({ type: "", text: "" });
    try {
      const tx = await contract.setApprovedIssuer(addr, true);
      await tx.wait();
      setStatus({ type: "success", text: `Address ${addr.slice(0, 10)}… approved as issuer.` });
      setCheckResult(null);
    } catch (err) {
      setStatus({ type: "error", text: err.message || "Transaction failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (e) => {
    e.preventDefault();
    if (!contract || !issuerAddress.trim()) return;
    const addr = issuerAddress.trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) {
      setStatus({ type: "error", text: "Enter a valid Ethereum address (0x...)." });
      return;
    }
    setLoading(true);
    setStatus({ type: "", text: "" });
    try {
      const tx = await contract.setApprovedIssuer(addr, false);
      await tx.wait();
      setStatus({ type: "success", text: `Address ${addr.slice(0, 10)}… removed as issuer.` });
      setCheckResult(null);
    } catch (err) {
      setStatus({ type: "error", text: err.message || "Transaction failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!readContract || !issuerAddress.trim()) return;
    const addr = issuerAddress.trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) {
      setCheckResult({ approved: null, error: "Invalid address." });
      return;
    }
    try {
      const approved = await readContract.isApprovedIssuer(addr);
      setCheckResult({ approved, error: null });
    } catch (err) {
      setCheckResult({ approved: null, error: err.message || "Check failed." });
    }
  };

  return (
    <section className="card admin-card">
      <h2>Manage approved issuers</h2>
      <p className="muted" style={{ marginBottom: "1rem" }}>
        Only the contract owner can add or remove verified institutions (universities, companies, government) that are allowed to register documents.
      </p>
      <form onSubmit={(e) => e.preventDefault()} className="admin-form">
        <div className="form-group">
          <label>Address (issuer wallet)</label>
          <input
            type="text"
            value={issuerAddress}
            onChange={(e) => setIssuerAddress(e.target.value)}
            placeholder="0x..."
            className="mono"
          />
        </div>
        <div className="admin-actions">
          <button type="button" className="btn btn-primary" onClick={handleApprove} disabled={loading}>
            {loading ? "Confirming…" : "Approve issuer"}
          </button>
          <button type="button" className="btn btn-outline" onClick={handleRevoke} disabled={loading}>
            Revoke issuer
          </button>
          <button type="button" className="btn btn-ghost" onClick={handleCheck}>
            Check status
          </button>
        </div>
      </form>
      {checkResult && (
        <div className="message info" style={{ marginTop: "1rem" }}>
          {checkResult.error ? (
            checkResult.error
          ) : (
            <>This address is <strong>{checkResult.approved ? "approved" : "not approved"}</strong> as an issuer.</>
          )}
        </div>
      )}
      {status.text && (
        <div className={`message ${status.type}`} style={{ marginTop: "1rem" }}>
          {status.text}
        </div>
      )}
    </section>
  );
}
