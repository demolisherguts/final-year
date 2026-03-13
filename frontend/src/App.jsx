import React, { useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ethers } from "ethers";
import { DOCUMENT_REGISTRY_ABI } from "./contracts/abi";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Upload from "./components/Upload";
import Verify from "./components/Verify";
import MyDocuments from "./components/MyDocuments";
import Admin from "./components/Admin";
import Footer from "./components/Footer";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL || "";
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";
const SEPOLIA_RPC = import.meta.env.VITE_SEPOLIA_RPC_URL || "";

export default function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");
  const [chainId, setChainId] = useState(null);
  const [contract, setContract] = useState(null);
  const [readContract, setReadContract] = useState(null);
  const [contractOwner, setContractOwner] = useState(null);
  const [error, setError] = useState("");

  const connect = useCallback(async () => {
    setError("");
    if (!window.ethereum) {
      setError("MetaMask not found. Install MetaMask to use DocScan.");
      return;
    }
    try {
      const p = new ethers.BrowserProvider(window.ethereum);
      const accounts = await p.send("eth_requestAccounts", []);
      const chain = await p.getNetwork();
      const s = await p.getSigner();
      const cid = Number(chain.chainId);
      setProvider(p);
      setSigner(s);
      setAddress(accounts[0]);
      setChainId(cid);
      if (CONTRACT_ADDRESS) {
        const withSigner = new ethers.Contract(CONTRACT_ADDRESS, DOCUMENT_REGISTRY_ABI, s);
        setContract(withSigner);
        withSigner.contractOwner().then((owner) => setContractOwner(owner)).catch(() => setContractOwner(null));
        if (cid === 31337) {
          try {
            const localProvider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
            setReadContract(new ethers.Contract(CONTRACT_ADDRESS, DOCUMENT_REGISTRY_ABI, localProvider));
          } catch (_) {
            setReadContract(withSigner);
          }
        } else if (cid === 11155111 && SEPOLIA_RPC) {
          try {
            const readProvider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
            setReadContract(new ethers.Contract(CONTRACT_ADDRESS, DOCUMENT_REGISTRY_ABI, readProvider));
          } catch (_) {
            setReadContract(withSigner);
          }
        } else {
          setReadContract(withSigner);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to connect wallet");
    }
  }, []);

  const disconnect = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setAddress("");
    setChainId(null);
    setContract(null);
    setReadContract(null);
    setContractOwner(null);
    setError("");
  }, []);

  const isOwner = address && contractOwner && address.toLowerCase() === contractOwner.toLowerCase();

  return (
    <Router>
      <div className="app">
        <Header
          address={address}
          chainId={chainId}
          onConnect={connect}
          onDisconnect={disconnect}
          error={error}
          isOwner={isOwner}
        />
        <main className="main">
          {!address && (
            <section className="hero">
              <h1 className="hero-title">DocScan</h1>
              <p className="hero-tagline">Decentralized document verification using Blockchain and IPFS</p>
              <p className="muted">Connect your wallet to upload or verify academic documents.</p>
              <button type="button" className="btn btn-primary hero-cta" onClick={connect}>
                Connect Wallet to Get Started
              </button>
            </section>
          )}
          {address && (
            <>
              <Dashboard />
              <Routes>
                <Route path="/" element={<Upload contract={contract} apiBase={API_BASE} address={address} readContract={readContract || contract} />} />
                <Route path="/verify" element={<Verify contract={readContract || contract} apiBase={API_BASE} />} />
                <Route path="/my-documents" element={<MyDocuments contract={readContract || contract} address={address} chainId={chainId} />} />
                <Route path="/admin" element={<Admin contract={contract} readContract={readContract || contract} address={address} />} />
              </Routes>
              <Footer />
            </>
          )}
        </main>
      </div>
    </Router>
  );
}
