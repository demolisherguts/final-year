import express from "express";
import cors from "cors";
import multer from "multer";
import { create } from "ipfs-http-client";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage for multer (no disk write)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

const IPFS_URL = process.env.IPFS_URL || "http://127.0.0.1:5001";
let ipfs = null;

try {
  ipfs = create(IPFS_URL);
} catch (e) {
  console.warn("IPFS not available at", IPFS_URL, "- upload will fail until IPFS is running");
}

/**
 * Compute SHA-256 hash of buffer, return as hex string (for bytes32: use 0x + hex).
 */
function sha256Hex(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

/**
 * Hex string to bytes32 format (0x + 64 hex chars).
 */
function toBytes32Hex(hex) {
  if (hex.startsWith("0x")) hex = hex.slice(2);
  return "0x" + hex.padStart(64, "0").slice(0, 64);
}

// POST /api/upload - upload file to IPFS, return CID and document hash (bytes32)
app.post("/api/upload", upload.single("document"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  if (!ipfs) {
    return res.status(503).json({ error: "IPFS not available" });
  }

  try {
    const buffer = req.file.buffer;
    const docHashHex = sha256Hex(buffer);
    const documentHash = toBytes32Hex(docHashHex);

    const result = await ipfs.add(buffer, { pin: true });
    const ipfsHash = result.cid.toString();

    res.json({
      ipfsHash,
      documentHash,
      documentHashHex: "0x" + docHashHex,
      fileName: req.file.originalname || "document",
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

// POST /api/hash - compute document hash only (for verification flow)
app.post("/api/hash", upload.single("document"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const docHashHex = sha256Hex(req.file.buffer);
  res.json({
    documentHash: toBytes32Hex(docHashHex),
    documentHashHex: "0x" + docHashHex,
  });
});

// GET /api/verify/:documentHash - optional server-side verification (contract state would be checked by frontend)
app.get("/api/verify/:documentHash", (req, res) => {
  const documentHash = req.params.documentHash;
  if (!documentHash || !/^0x[0-9a-fA-F]{64}$/.test(documentHash)) {
    return res.status(400).json({ error: "Invalid document hash (expected 0x + 64 hex)" });
  }
  res.json({ documentHash, message: "Use frontend + contract to verify on-chain" });
});

// GET /api/stats - system statistics placeholder
app.get("/api/stats", (_req, res) => {
  res.json({
    service: "DocScan API",
    ipfsConnected: !!ipfs,
    ipfsUrl: IPFS_URL,
  });
});

// Health
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("DocScan backend running on http://localhost:" + PORT);
});
