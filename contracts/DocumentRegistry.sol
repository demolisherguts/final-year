// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DocumentRegistry
 * @dev Decentralized document verification - stores document hashes on-chain, documents on IPFS.
 * Part of DocScan: academic credential verification using Blockchain and IPFS.
 */
contract DocumentRegistry {
    struct DocumentRecord {
        string ipfsHash;      // IPFS CID for document retrieval
        bytes32 documentHash; // SHA-256 hash for integrity verification
        address owner;       // Address that registered the document
        uint256 timestamp;   // Block timestamp when registered
        string documentName; // Human-readable document name
        bool exists;         // Ensures record exists (mapping default is false)
    }

    // documentHash => DocumentRecord (primary lookup for verification)
    mapping(bytes32 => DocumentRecord) public documentsByHash;

    // owner => list of document hashes they registered (for listing)
    mapping(address => bytes32[]) private documentsByOwner;

    // Prevent duplicate registration by document hash
    mapping(bytes32 => bool) private registeredHashes;

    address public contractOwner;

    /// @dev Only approved issuers (universities, companies, government) can register documents.
    mapping(address => bool) public approvedIssuers;

    event DocumentRegistered(
        bytes32 indexed documentHash,
        string ipfsHash,
        address indexed owner,
        uint256 timestamp,
        string documentName
    );

    event IssuerApproved(address indexed issuer, bool approved);

    error EmptyIpfsHash();
    error EmptyDocumentHash();
    error EmptyDocumentName();
    error DocumentAlreadyRegistered();
    error NotApprovedIssuer();
    error InvalidAddress();

    constructor() {
        contractOwner = msg.sender;
        approvedIssuers[msg.sender] = true; // Deployer is first approved issuer (for local/testing).
    }

    /**
     * @dev Only approved issuers (verified universities, companies, government) can register.
     * The contract owner adds/removes approved issuers via setApprovedIssuer.
     */
    function setApprovedIssuer(address issuer, bool approved) external {
        if (msg.sender != contractOwner) revert InvalidAddress();
        approvedIssuers[issuer] = approved;
        emit IssuerApproved(issuer, approved);
    }

    /**
     * @dev Register a document: store IPFS CID and SHA-256 hash on-chain.
     * Callable only by approved issuers (verified institutions).
     */
    function registerDocument(
        string calldata ipfsHash,
        bytes32 documentHash,
        string calldata documentName
    ) external {
        if (!approvedIssuers[msg.sender]) revert NotApprovedIssuer();
        if (bytes(ipfsHash).length == 0) revert EmptyIpfsHash();
        if (documentHash == bytes32(0)) revert EmptyDocumentHash();
        if (bytes(documentName).length == 0) revert EmptyDocumentName();
        if (registeredHashes[documentHash]) revert DocumentAlreadyRegistered();

        registeredHashes[documentHash] = true;

        DocumentRecord storage record = documentsByHash[documentHash];
        record.ipfsHash = ipfsHash;
        record.documentHash = documentHash;
        record.owner = msg.sender;
        record.timestamp = block.timestamp;
        record.documentName = documentName;
        record.exists = true;

        documentsByOwner[msg.sender].push(documentHash);

        emit DocumentRegistered(
            documentHash,
            ipfsHash,
            msg.sender,
            block.timestamp,
            documentName
        );
    }

    /**
     * @dev Verify a document by hash. Gas-free read-only.
     * @param documentHash SHA-256 hash of the document to verify
     * @return exists Whether a record exists for this hash
     * @return ipfsHash IPFS CID if exists
     * @return owner Registrar address if exists
     * @return timestamp Registration time if exists
     * @return documentName Document name if exists
     */
    function verifyDocument(bytes32 documentHash)
        external
        view
        returns (
            bool exists,
            string memory ipfsHash,
            address owner,
            uint256 timestamp,
            string memory documentName
        )
    {
        DocumentRecord storage record = documentsByHash[documentHash];
        return (
            record.exists,
            record.ipfsHash,
            record.owner,
            record.timestamp,
            record.documentName
        );
    }

    /**
     * @dev Check if an address is an approved issuer (can register documents).
     */
    function isApprovedIssuer(address account) external view returns (bool) {
        return approvedIssuers[account];
    }

    /**
     * @dev Get number of documents registered by an owner.
     */
    function getDocumentCountByOwner(address owner) external view returns (uint256) {
        return documentsByOwner[owner].length;
    }

    /**
     * @dev Get document hash at index for an owner (for listing).
     */
    function getDocumentHashByOwnerIndex(address owner, uint256 index)
        external
        view
        returns (bytes32)
    {
        require(index < documentsByOwner[owner].length, "Index out of bounds");
        return documentsByOwner[owner][index];
    }
}
