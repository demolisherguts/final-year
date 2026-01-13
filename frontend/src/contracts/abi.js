// DocumentRegistry ABI (minimal for frontend)
export const DOCUMENT_REGISTRY_ABI = [
  "function registerDocument(string calldata ipfsHash, bytes32 documentHash, string calldata documentName) external",
  "function verifyDocument(bytes32 documentHash) external view returns (bool exists, string memory ipfsHash, address owner, uint256 timestamp, string memory documentName)",
  "function isApprovedIssuer(address account) external view returns (bool)",
  "function setApprovedIssuer(address issuer, bool approved) external",
  "function contractOwner() external view returns (address)",
  "function getDocumentCountByOwner(address owner) external view returns (uint256)",
  "function getDocumentHashByOwnerIndex(address owner, uint256 index) external view returns (bytes32)",
  "function documentsByHash(bytes32) external view returns (string memory ipfsHash, bytes32 documentHash, address owner, uint256 timestamp, string memory documentName, bool exists)",
  "event DocumentRegistered(bytes32 indexed documentHash, string ipfsHash, address indexed owner, uint256 timestamp, string documentName)",
  "event IssuerApproved(address indexed issuer, bool approved)",
];
