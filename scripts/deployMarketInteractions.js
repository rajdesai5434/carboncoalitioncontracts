const hre = require("hardhat");

async function main() {
  console.log("deploying...");

  const deployedContract = await ethers.deployContract("AaveMarketInteractions");
  await deployedContract.waitForDeployment();

  console.log(
    "AaveMarketInteractions loan contract deployed: ",
    await deployedContract.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});