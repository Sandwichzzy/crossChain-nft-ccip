//prepare variables:contract ,account

let firstAccount;
let ccipSimulator;
let nft;
let nftPoolLockAndRelease;
let wnft;
let nftPoolBurnAndMint;

beforeEach(async function (hre) {
  const { getNamedAccounts, deployments } = hre;
  //set up accounts
  firstAccount = (await getNamedAccounts()).firstAccount;

  //deploy contracts
  await deployments.fixture(["all"]);

  //ethers.getContract 从部署记录中获取合约实例,依赖部署记录
  //ethers.getContractAt 需要手动提供已存在的合约
  //   const nftDeployment = await deployments.get("MyToken");
  //   nft = await ethers.getContractAt("MyToken", nftDeployment.address);

  //获取已部署合约的实例
  ccipSimulator = await ethers.getContract("CCIPSimulator", firstAccount);
  nft = await ethers.getContract("MyToken", firstAccount);
  nftPoolLockAndRelease = await ethers.getContract(
    "NFTPoolLockAndRelease",
    firstAccount
  );
  wnft = await ethers.getContract("WrappedMyToken", firstAccount);
  nftPoolBurnAndMint = await ethers.getContract(
    "NFTPoolBurnAndMint",
    firstAccount
  );
});

//source chain ->dest chain
describe("source chain ->dest chain tests", async function () {
  it("test if user can mint a nft from nft contract successfully", async function () {
    await nft.safeMint(firstAccount, 1);
  });
});
//test if user can mint a nft from nft contract successfully

//test if user can lock a nft in the pool on source chain and send ccip message to dest chain

//test if user can get a wrapped nft in dest chain

//dest chain ->source chain
//test if user can burn a wrapped wnft on dest chain and send ccip message to soucre chain

//test if user have the nft unlocked on source chain
