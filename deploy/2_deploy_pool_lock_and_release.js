module.exports = async (hre) => {
  const { getNamedAccounts, deployments } = hre;
  const { firstAccount } = await getNamedAccounts();
  const { deploy, log } = deployments;

  log("Deploying pool lock and release contract...");
  //address _router, address _token, address nftaddr

  const ccipSimulatorDeployment = await deployments.get("CCIPLocalSimulator");
  const ccipSimulator = await ethers.getContractAt(
    "CCIPLocalSimulator",
    ccipSimulatorDeployment.address
  );

  const ccipConfig = await ccipSimulator.configuration();
  const sourceChainRouter = ccipConfig.sourceRouter_;
  const linkTokenAddr = ccipConfig.linkToken_;

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
