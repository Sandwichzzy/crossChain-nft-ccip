module.exports = async (hre) => {
  const { getNamedAccounts, deployments } = hre;
  const { firstAccount } = await getNamedAccounts();
  const { deploy, log } = deployments;

  log("Deploying CCIPLocalSimulator contract...");
  await deploy("CCIPLocalSimulator", {
    contract: "CCIPLocalSimulator",
    from: firstAccount,
    log: true,
    args: [],
  });
  log("CCIPSimulator contract deployed successfully");
};
module.exports.tags = ["test", "all"];
