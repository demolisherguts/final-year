import React from "react";
import { Link, useLocation } from "react-router-dom";

const NETWORK_NAMES = { 31337: "Hardhat Local", 11155111: "Sepolia", 1: "Ethereum" };

export default function Header({ address, chainId, onConnect, onDisconnect, error, isOwner }) {
  const location = useLocation();
  const shortAddress = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";
  const networkName = chainId != null ? (NETWORK_NAMES[chainId] || `Chain ${chainId}`) : "—";

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">◇</span> DocScan
        </Link>
        <nav className="nav">
          {address && (
            <>
              <Link to="/" className={location.pathname === "/" ? "active" : ""}>Upload</Link>
              <Link to="/verify" className={location.pathname === "/verify" ? "active" : ""}>Verify</Link>
              <Link to="/my-documents" className={location.pathname === "/my-documents" ? "active" : ""}>My Documents</Link>
              {isOwner && (
                <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>Admin</Link>
              )}
            </>
          )}
        </nav>
        <div className="wallet">
          {error && <span className="header-error">{error}</span>}
          {address ? (
            <>
              <span className="network-badge" title={`Chain ID ${chainId}`}>{networkName}</span>
              <span className="address" title={address}>{shortAddress}</span>
              <button type="button" className="btn btn-outline" onClick={onDisconnect}>
                Disconnect
              </button>
            </>
          ) : (
            <button type="button" className="btn btn-primary" onClick={onConnect}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
