module.exports = async (hre) => {
  const { getNamedAccounts, deployments } = hre;
  const { firstAccount } = await getNamedAccounts();
  const { deploy, log } = deployments;
  log("Deploying wnft contract...");
  await deploy("WrappedMyToken", {
    contract: "WrappedMyToken",
    from: firstAccount,
    log: true,
    args: ["WrappedMyToken", "WMTK"],
  });
  log("WNFT contract deployed successfully");
};
module.exports.tags = ["destChain", "all"];
