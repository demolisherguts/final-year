import React, { useState } from "react";

export default function CopyBtn({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  return (
    <button type="button" className="copy-btn" onClick={handleCopy} title="Copy">
      {copied ? "Copied!" : label}
    </button>
  );
}
