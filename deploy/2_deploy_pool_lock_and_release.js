const { network } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");

module.exports = async (hre) => {
  const { getNamedAccounts, deployments } = hre;
  const { firstAccount } = await getNamedAccounts();
  const { deploy, log } = deployments;

  log("Deploying pool lock and release contract...");
  //address _router, address _token, address nftaddr

  let sourceChainRouter;
  let linkTokenAddr;
  if (developmentChains.includes(network.name)) {
    const ccipSimulatorDeployment = await deployments.get("CCIPLocalSimulator");
    const ccipSimulator = await ethers.getContractAt(
      "CCIPLocalSimulator",
      ccipSimulatorDeployment.address
    );
    const ccipConfig = await ccipSimulator.configuration();
    //  * @notice Returns configuration details for pre-deployed contracts and services needed for local CCIP simulations.
    //  *
    //  * @return chainSelector_ - The unique CCIP Chain Selector.
    //  * @return sourceRouter_  - The source chain Router contract.
    //  * @return destinationRouter_ - The destination chain Router contract.
    //  * @return linkToken_ - The LINK token.

    sourceChainRouter = ccipConfig.sourceRouter_;
    linkTokenAddr = ccipConfig.linkToken_;
  } else {
    sourceChainRouter = networkConfig[network.config.chainId].router;
    linkTokenAddr = networkConfig[network.config.chainId].linkToken;
  }

  const nftDeployment = await deployments.get("MyToken");
  const nftAddr = nftDeployment.address;
  await deploy("NFTPoolLockAndRelease", {
    contract: "NFTPoolLockAndRelease",
    from: firstAccount,
    log: true,
    args: [sourceChainRouter, linkTokenAddr, nftAddr],
  });
  log("PoolLockAndRelease contract deployed successfully");
};

module.exports.tags = ["sourcechain", "all"];
