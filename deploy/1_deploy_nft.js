module.exports = async (hre) => {
  const { getNamedAccounts, deployments } = hre;
  const { firstAccount } = await getNamedAccounts();
  const { deploy, log } = deployments;
  log("Deploying nft contract...");
  await deploy("MyToken", {
    contract: "MyToken",
    from: firstAccount,
    log: true,
    args: ["MyToken", "MTK"],
  });
  log("NFT contract deployed successfully");
};
module.exports.tags = ["sourcechain", "all"];
