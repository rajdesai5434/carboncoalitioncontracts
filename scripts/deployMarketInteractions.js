const hre = require("hardhat");

async function main() {
  console.log("deploying...");

  const deployedContract = await ethers.deployContract("MarketInteractions");
  await deployedContract.waitForDeployment();

  console.log(
    "MarketInteractions loan contract deployed: ",
    await deployedContract.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});