const { task } = require("hardhat/config");

task("mint-nft").setAction(async (taskArgs, hre) => {
  const { firstAccount } = await hre.getNamedAccounts();
  const nft = await ethers.getContract("MyToken", firstAccount);

  console.log("minting a nft from contract");
  const mintTx = await nft.safeMint(firstAccount, 1);
  mintTx.wait(6);
  console.log("NFT minted successfully");
});
module.exports = {};
