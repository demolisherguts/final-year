import React, { useState, useEffect } from "react";
import CopyBtn from "./CopyBtn";

export default function Upload({ contract, apiBase, address, readContract }) {
  const [file, setFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [status, setStatus] = useState({ type: "", text: "" });
  const [lastSuccess, setLastSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isApprovedIssuer, setIsApprovedIssuer] = useState(null);

  useEffect(() => {
    if (!readContract || !address) {
      setIsApprovedIssuer(null);
      return;
    }
    let cancelled = false;
    readContract.isApprovedIssuer(address).then((approved) => {
      if (!cancelled) setIsApprovedIssuer(approved);
    }).catch(() => { if (!cancelled) setIsApprovedIssuer(false); });
    return () => { cancelled = true; };
  }, [readContract, address]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    setFile(f);
    if (f && !documentName) setDocumentName(f.name);
    setStatus({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !documentName.trim()) {
      setStatus({ type: "error", text: "Select a file and enter a document name." });
      return;
    }
    if (!contract) {
      setStatus({ type: "error", text: "Contract not configured. Set VITE_CONTRACT_ADDRESS." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("document", file);
      const res = await fetch(`${apiBase || ""}/api/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      const tx = await contract.registerDocument(
        data.ipfsHash,
        data.documentHash,
        documentName.trim()
      );
      setStatus({ type: "info", text: "Transaction sent. Waiting for confirmation..." });
      await tx.wait();
      setLastSuccess({ ipfsHash: data.ipfsHash, txHash: tx.hash, name: documentName.trim() });
      setStatus({ type: "success", text: "Document registered on-chain. Stay on this network to verify or view My Documents." });
      setFile(null);
      setDocumentName("");
      e.target.reset();
    } catch (err) {
      const msg = err.message || "";
      const data = err.data || err.error?.data || "";
      const isDuplicate = msg.includes("DocumentAlreadyRegistered") || msg.includes("0x8d7ef8e0") || String(data).includes("0x8d7ef8e0");
      const isNotApproved = msg.includes("NotApprovedIssuer");
      setStatus({
        type: "error",
        text: isDuplicate
          ? "This document is already registered on-chain. Use Verify to check it, or upload a different file."
          : isNotApproved
            ? "Only verified institutions (universities, companies, government) can register documents. Your wallet is not an approved issuer. Use Verify to check documents."
            : msg || "Upload or registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const notApproved = isApprovedIssuer === false;

  return (
    <section className="card">
      <h2>Upload Document</h2>
      <p className="muted" style={{ marginBottom: "1rem" }}>
        Only <strong>verified issuers</strong> (universities, companies, government) can register documents. File is stored on IPFS; its hash is recorded on the blockchain.
      </p>
      {notApproved && (
        <div className="message info" style={{ marginBottom: "1rem" }}>
          Your wallet is not an approved issuer. You can still use <strong>Verify</strong> to check if a document is registered. Contact the contract owner to be added as an issuer.
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Document file</label>
          <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" required />
        </div>
        <div className="form-group">
          <label>Document name</label>
          <input
            type="text"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            placeholder="e.g. Degree Certificate 2024"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading || notApproved}>
          {loading ? "Uploading & registering…" : notApproved ? "Only approved issuers can register" : "Upload to IPFS & Register on Chain"}
        </button>
      </form>
      {status.text && (
        <div className={`message ${status.type}`} style={{ marginTop: "1rem" }}>
          {status.text}
          {lastSuccess && status.type === "success" && (
            <div className="success-detail">
              <div className="data-row">
                <span>IPFS:</span>
                <code style={{ wordBreak: "break-all" }}>{lastSuccess.ipfsHash}</code>
                <CopyBtn text={lastSuccess.ipfsHash} />
              </div>
              <div className="data-row" style={{ marginTop: "0.5rem" }}>
                <span>Tx:</span>
                <code style={{ wordBreak: "break-all" }}>{lastSuccess.txHash}</code>
                <CopyBtn text={lastSuccess.txHash} />
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
