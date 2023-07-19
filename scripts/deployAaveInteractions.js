const hre = require("hardhat");

async function main() {
  console.log("deploying...");

  const provider = ethers.provider;
  const fee = await provider.getFeeData();
  gasPrice = fee['gasPrice'];
  console.log("Gas Price: ",Number(gasPrice));

  const deployedContract = await ethers.deployContract("AaveInteractions");
  await deployedContract.waitForDeployment();

  console.log(
    "AaveInteractions loan contract deployed: ",
    await deployedContract.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});