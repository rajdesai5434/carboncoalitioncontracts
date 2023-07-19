const hre = require("hardhat");
require("dotenv-flow").config({
    silent: true
});

async function main() {
    console.log("Testing..");

    const [account] = await ethers.getSigners();
    console.log("Wallet Address:",account.address);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });