const hre = require("hardhat");

async function main() {
  console.log("deploying...");

  const deployedContract = await ethers.deployContract("UniswapInteractions");
  await deployedContract.waitForDeployment();

  console.log(
    "UniswapInteractions loan contract deployed: ",
    await deployedContract.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});