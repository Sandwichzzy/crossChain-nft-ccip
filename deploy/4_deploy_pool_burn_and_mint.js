module.exports = async (hre) => {
  const { getNamedAccounts, deployments } = hre;
  const { firstAccount } = await getNamedAccounts();
  const { deploy, log } = deployments;

  log("Deploying pool burn and mint contract...");
  //address _router, address _token, address nftaddr

  const ccipSimulatorDeployment = await deployments.get("CCIPLocalSimulator");
  const ccipSimulator = await ethers.getContractAt(
    "CCIPLocalSimulator",
    ccipSimulatorDeployment.address
  );

  const ccipConfig = await ccipSimulator.configuration();
  const destChainRouter = ccipConfig.destinationRouter_;
  const linkTokenAddr = ccipConfig.linkToken_;

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
