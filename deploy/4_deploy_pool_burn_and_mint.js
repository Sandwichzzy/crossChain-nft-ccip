const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { network } = require("hardhat");

module.exports = async (hre) => {
  const { getNamedAccounts, deployments } = hre;
  const { firstAccount } = await getNamedAccounts();
  const { deploy, log } = deployments;

  log("Deploying pool burn and mint contract...");
  //address _router, address _token, address nftaddr

  let destChainRouter;
  let linkTokenAddr;
  if (developmentChains.includes(network.name)) {
    const ccipSimulatorDeployment = await deployments.get("CCIPLocalSimulator");
    const ccipSimulator = await ethers.getContractAt(
      "CCIPLocalSimulator",
      ccipSimulatorDeployment.address
    );
    const ccipConfig = await ccipSimulator.configuration();
    destChainRouter = ccipConfig.destinationRouter_;
    linkTokenAddr = ccipConfig.linkToken_;
  } else {
    destChainRouter = networkConfig[network.config.chainId].router;
    linkTokenAddr = networkConfig[network.config.chainId].linkToken;
  }

  const wnftDeployment = await deployments.get("WrappedMyToken");
  const wnftAddr = wnftDeployment.address;

  await deploy("NFTPoolBurnAndMint", {
    contract: "NFTPoolBurnAndMint",
    from: firstAccount,
    log: true,
    args: [destChainRouter, linkTokenAddr, wnftAddr],
  });
  log("PoolBurnAndMint contract deployed successfully");
};

module.exports.tags = ["destChain", "all"];
