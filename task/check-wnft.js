const { task } = require("hardhat/config");

task("check-nft").setAction(async (taskArgs, hre) => {
  const { firstAccount } = await hre.getNamedAccounts();
  const wnft = await ethers.getContract("WrappedMyToken", firstAccount);

  const totalSupply = await wnft.totalSupply();
  console.log("checking status of myToken");
  for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
    const owner = await wnft.ownerOf(tokenId);
    console.log(`Token ID: ${tokenId} - Owner: ${owner}`);
  }
});

module.exports = {};
