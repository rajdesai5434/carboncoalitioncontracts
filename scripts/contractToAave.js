const hre = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("Supply to Aave..");

    const [account] = await ethers.getSigners();
    console.log("Wallet Address:",account.address);

    const aaveInteractionsContract = require("../artifacts/contracts/AaveInteractions.sol/AaveInteractions.json");
    const aaveInteractions = new ethers.Contract(process.env.CONTRACT_ADDRESS, aaveInteractionsContract.abi,account);
    console.log("AaveInteractions address:", await aaveInteractions.getAddress());

    const usdcCoin = new ethers.Contract(process.env.USDC_CONTRACT_ADDRESS, process.env.USDC_CONTRACT_ABI,account);
    console.log("USDC address:", await usdcCoin.getAddress());

    //const aUSDC = new ethers.Contract(process.env.aUSDC_CONTRACT_ADDRESS,process.env.aUSDC_CONTRACT_ABI);
    //console.log("aUSDC address:", await aUSDC.getAddress());

    //Get account balance of contract
    const bal = await aaveInteractions.getBalanceContract(process.env.CONTRACT_ADDRESS,process.env.USDC_CONTRACT_ADDRESS);
    console.log("Contract USDC balance: ",Number(bal));
    
    const approve1 = await aaveInteractions.approveAaveTransfer(1000,process.env.AAVE_POOL_ADDRESS_PROVIDER,process.env.USDC_CONTRACT_ADDRESS,{gasLimit:1000000});
    await approve1.wait();
    console.log("Approval hash to send coins to Aave: ", approve1.hash);

    //Allowance  
    const allow1 = await aaveInteractions.allowanceAaveTransfer(process.env.CONTRACT_ADDRESS,process.env.AAVE_POOL_ADDRESS_PROVIDER,process.env.USDC_CONTRACT_ADDRESS,{gasLimit:1000000});
    console.log("Allowance: ", Number(allow1));
    
    //1.1 Move money from contract to Aave
    const transfer1 = await aaveInteractions.supplyLiquidityAave(1000,process.env.CONTRACT_ADDRESS,process.env.USDC_CONTRACT_ADDRESS,{gasLimit:1000000});
    await transfer1.wait();
    console.log("Transfer hash of coins to Aave: ", transfer1.hash);

    //get aToken balance of the contract
    const abal = await aaveInteractions.getBalanceContract(process.env.CONTRACT_ADDRESS,process.env.aUSDC_CONTRACT_ADDRESS);
    console.log("Contract aUSDC balance: ",Number(abal));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});