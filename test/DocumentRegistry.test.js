const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DocumentRegistry", function () {
  let registry;
  let owner;
  let user;

  const IPFS_HASH = "QmTest123";
  const DOC_NAME = "Degree Certificate 2024";

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const DocumentRegistry = await ethers.getContractFactory("DocumentRegistry");
    registry = await DocumentRegistry.deploy();
  });

  it("Should deploy and set contract owner", async function () {
    expect(await registry.contractOwner()).to.equal(owner.address);
  });

  it("Should register a document and verify it (approved issuer)", async function () {
    await registry.setApprovedIssuer(user.address, true);
    const documentHash = ethers.keccak256(ethers.toUtf8Bytes("doc content"));
    await registry.connect(user).registerDocument(IPFS_HASH, documentHash, DOC_NAME);

    const [exists, ipfsHash, docOwner, timestamp, name] = await registry.verifyDocument(documentHash);
    expect(exists).to.be.true;
    expect(ipfsHash).to.equal(IPFS_HASH);
    expect(docOwner).to.equal(user.address);
    expect(timestamp).to.be.gt(0);
    expect(name).to.equal(DOC_NAME);
  });

  it("Should reject registration from non-approved issuer", async function () {
    const documentHash = ethers.keccak256(ethers.toUtf8Bytes("doc"));
    await expect(
      registry.connect(user).registerDocument(IPFS_HASH, documentHash, DOC_NAME)
    ).to.be.revertedWithCustomError(registry, "NotApprovedIssuer");
  });

  it("Should reject duplicate registration", async function () {
    await registry.setApprovedIssuer(user.address, true);
    const documentHash = ethers.keccak256(ethers.toUtf8Bytes("same doc"));
    await registry.connect(user).registerDocument(IPFS_HASH, documentHash, DOC_NAME);
    await expect(
      registry.connect(user).registerDocument(IPFS_HASH, documentHash, "Other")
    ).to.be.revertedWithCustomError(registry, "DocumentAlreadyRegistered");
  });

  it("Should reject empty ipfsHash", async function () {
    const documentHash = ethers.keccak256(ethers.toUtf8Bytes("x"));
    await expect(
      registry.registerDocument("", documentHash, DOC_NAME)
    ).to.be.revertedWithCustomError(registry, "EmptyIpfsHash");
  });

  it("Should list documents by owner", async function () {
    await registry.setApprovedIssuer(user.address, true);
    const h1 = ethers.keccak256(ethers.toUtf8Bytes("1"));
    const h2 = ethers.keccak256(ethers.toUtf8Bytes("2"));
    await registry.connect(user).registerDocument("Qm1", h1, "Doc1");
    await registry.connect(user).registerDocument("Qm2", h2, "Doc2");

    expect(await registry.getDocumentCountByOwner(user.address)).to.equal(2);
    expect(await registry.getDocumentHashByOwnerIndex(user.address, 0)).to.equal(h1);
    expect(await registry.getDocumentHashByOwnerIndex(user.address, 1)).to.equal(h2);
  });
});
