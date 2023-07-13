const hre = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("Supply to Contract..");

    const [account] = await ethers.getSigners();
    console.log("Wallet Address:",account.address);

    const aaveInteractionsContract = require("../artifacts/contracts/AaveInteractions.sol/AaveInteractions.json");
    const aaveInteractions = new ethers.Contract(process.env.CONTRACT_ADDRESS, aaveInteractionsContract.abi, account);
    console.log("AaveInteractions address:", await aaveInteractions.getAddress());

    const usdcCoin = new ethers.Contract(process.env.USDC_CONTRACT_ADDRESS, process.env.USDC_CONTRACT_ABI, account);
    console.log("USDC address:", await usdcCoin.getAddress());

    //Get account balance of contract
    const abal = await aaveInteractions.getBalanceContract(account.address,process.env.USDC_CONTRACT_ADDRESS);
    console.log("User USDC balance: ",Number(abal));

    //1. Approve transfer of money from wallet to contract
    const approve1 = await usdcCoin.approve(process.env.CONTRACT_ADDRESS,1000,{gasLimit:1000000});
    await approve1.wait();
    console.log("Approval hash to send coins to contract: ", approve1.hash);

    const allow1 = await usdcCoin.allowance(account.address,process.env.CONTRACT_ADDRESS,{gasLimit:1000000});
    console.log("Allowance: ", Number(allow1));

    //1.1 Move money from wallet to contract
    const transfer1 = await aaveInteractions.depositToContract(1000,process.env.USDC_CONTRACT_ADDRESS,{gasLimit:1000000});
    await transfer1.wait();
    console.log("Transfer hash of coins to contract: ", transfer1.hash);

    //Get account balance of contract
    const bal = await aaveInteractions.getBalanceContract(process.env.CONTRACT_ADDRESS,process.env.USDC_CONTRACT_ADDRESS);
    console.log("Contract USDC balance: ",Number(bal));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});