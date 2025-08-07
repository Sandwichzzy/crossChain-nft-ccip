const { task } = require("hardhat/config");
const { networkConfig } = require("../helper-hardhat-config");

task("burn-and-cross")
  .addOptionalParam("chainselector", "chain selector of dest chain")
  .addOptionalParam("receiver", "receiver address on dest chain")
  .addParam("tokenid", "token id to be crossed chain")
  .setAction(async (taskArgs, hre) => {
    const { firstAccount } = await hre.getNamedAccounts();
    const tokenId = taskArgs.tokenid;
    let destChainSelector;
    if (taskArgs.chainselector) {
      destChainSelector = taskArgs.chainselector;
    } else {
      destChainSelector =
        networkConfig[network.config.chainId].companionChainSelector;
      console.log(`chainselector is not set in command`);
    }
    console.log(`chainselector is ${destChainSelector}`);

    let destReceiver;
    if (taskArgs.receiver) {
      destReceiver = taskArgs.receiver;
    } else {
      const nftPoolLockandReleaseDeployment = await hre.companionNetworks[
        "destChain"
      ].deployments.get("NFTPoolLockAndRelease");
      destReceiver = nftPoolLockandReleaseDeployment.address;
      console.log("receiver is not set in command");
    }

    console.log(`receive's address is ${destReceiver}`);

    //transfer Link token to address of the pool
    const linkTokenAddress = networkConfig[network.config.chainId].linkToken;
    const linkToken = await ethers.getContractAt("LinkToken", linkTokenAddress);
    const nftPoolBurnAndMint = await ethers.getContract(
      "NFTPoolBurnAndMint",
      firstAccount
    );
    const transferTx = await linkToken.transfer(
      nftPoolBurnAndMint.target,
      ethers.parseEther(10)
    );
    await transferTx.wait(6);
    const balance = await linkToken.balanceOf(nftPoolBurnAndMint.target);
    console.log(`balance of pool is ${balance}`);
    //approve pool address to cal transferFrom
    const wnft = await ethers.getContract("WrappedMyToken", firstAccount);
    wnft.approve(nftPoolBurnAndMint.target, tokenId);
    console.log("approve success");

    //call lockandSendNFT
    const burnAndSendNFTtx = await nftPoolBurnAndMint.burnAndSendNFT(
      tokenId,
      firstAccount,
      destChainSelector,
      destReceiver
    );
    console.log(
      `ccip transaction is sent the tx hash is ${burnAndSendNFTtx.hash}`
    );
  });

module.exports = {};
