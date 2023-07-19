const hre = require("hardhat");
require("dotenv-flow").config({
  silent: true
});

async function main() {
  console.log("deploying...");

  const deployedContract = await hre.ethers.getContractFactory("UniswapInteractions");
  const contract = await deployedContract.deploy(process.env.TOKEN_ADDRESS,process.env.CARBON_CREDIT_ADDRESS,process.env.ROUTER_ADDRESS);
  await contract.waitForDeployment();

  console.log("UniswapInteractions loan contract deployed: ", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
