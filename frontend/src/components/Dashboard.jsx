import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard({ docCount }) {
  return (
    <section className="dashboard-section">
      <div className="dashboard-grid">
        <Link to="/" className="dashboard-tile dashboard-tile-link">
          <span className="num">Upload</span>
          <span className="label">Register a document on-chain</span>
        </Link>
        <Link to="/verify" className="dashboard-tile dashboard-tile-link">
          <span className="num">Verify</span>
          <span className="label">Check if a document is registered</span>
        </Link>
        <Link to="/my-documents" className="dashboard-tile dashboard-tile-link">
          <span className="num">My Docs</span>
          <span className="label">View registered documents</span>
        </Link>
      </div>
    </section>
  );
}
