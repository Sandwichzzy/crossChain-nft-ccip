const { expect } = require("chai");
const { ethers } = require("hardhat");

//prepare variables:contract ,account

let firstAccount;
let ccipSimulator;
let nft;
let nftPoolLockAndRelease;
let wnft;
let nftPoolBurnAndMint;
let chainSelector;

before(async function (hre) {
  const { getNamedAccounts, deployments } = hre;
  //set up accounts
  firstAccount = (await getNamedAccounts()).firstAccount;

  //deploy contracts
  await deployments.fixture(["all"]);

  //ethers.getContract 从部署记录中获取合约实例,依赖部署记录
  //ethers.getContractAt 需要手动提供已存在的合约
  //   const nftDeployment = await deployments.get("MyToken");
  //   nft = await ethers.getContractAt("MyToken", nftDeployment.address);

  //获取已部署合约的实例
  ccipSimulator = await ethers.getContract("CCIPSimulator", firstAccount);
  nft = await ethers.getContract("MyToken", firstAccount);
  nftPoolLockAndRelease = await ethers.getContract(
    "NFTPoolLockAndRelease",
    firstAccount
  );
  wnft = await ethers.getContract("WrappedMyToken", firstAccount);
  nftPoolBurnAndMint = await ethers.getContract(
    "NFTPoolBurnAndMint",
    firstAccount
  );
  const config = await ccipSimulator.configuration();
  chainSelector = config.chainSelector_;
});

//source chain ->dest chain
describe("source chain ->dest chain tests", async function () {
  it("test if user can mint a nft from nft contract successfully", async function () {
    await nft.safeMint(firstAccount);
    const owner = await nft.ownerOf(0);
    expect(owner).to.equal(firstAccount);
  });

  it("test if user can lock a nft in the pool on source chain and send ccip message to dest chain", async function () {
    await nft.approve(nftPoolLockAndRelease.target, 0);
    //在 ethers.js v6 中，合约实例的地址属性发生了变化：
    //contract.address (v5 及之前版本)
    //contract.target (v6 版本)
    await ccipSimulator.requestLinkFromFaucet(
      nftPoolLockAndRelease,
      ethers.parseEther("10")
    );
    await nftPoolLockAndRelease.lockAndSendNFT(
      0,
      firstAccount,
      chainSelector,
      nftPoolBurnAndMint.target
    );
    const owner = await nft.ownerOf(0);
    expect(owner).to.equal(nftPoolLockAndRelease.target);
  });

  it("test if user can get a wrapped nft in dest chain", async function () {
    const owner = await wnft.ownerOf(0);
    expect(owner).to.equal(firstAccount);
  });
});

//dest chain ->source chain
describe("dest chain ->source chain tests", async function () {
  it("test if user can burn a wrapped wnft on dest chain and send ccip message to soucre chain", async function () {
    await wnft.approve(nftPoolBurnAndMint.target, 0);
    await ccipSimulator.requestLinkFromFaucet(
      nftPoolBurnAndMint,
      ethers.parseEther("10")
    );
    await nftPoolBurnAndMint.burnAndSendNFT(
      0,
      firstAccount,
      chainSelector,
      nftPoolLockAndRelease.target
    );
    const totalSupply = await wnft.totalSupply();
    expect(totalSupply).to.equal(0);
  });

  it("test if user have the unlocked nft on source chain", async function () {
    const owner = await nft.ownerOf(0);
    expect(owner).to.equal(firstAccount);
  });
});
