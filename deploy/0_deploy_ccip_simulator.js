const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async (hre) => {
  if (developmentChains.includes(network.name)) {
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
  } else {
    log("Skipping CCIPSimulator deployment on non-development chain");
  }
};
module.exports.tags = ["test", "all"];
