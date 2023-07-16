const hre = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("Calculating Interest...");

    const [account] = await ethers.getSigners();
    console.log("Wallet Address:",account.address);

    const aaveInteractionsContract = require("../artifacts/contracts/AaveInteractions.sol/AaveInteractions.json");
    const aaveInteractions = new ethers.Contract(process.env.CONTRACT_ADDRESS, aaveInteractionsContract.abi,account);
    console.log("AaveInteractions address:", await aaveInteractions.getAddress());

    const usdcCoin = new ethers.Contract(process.env.USDC_CONTRACT_ADDRESS, process.env.USDC_CONTRACT_ABI,account);
    console.log("USDC address:", await usdcCoin.getAddress());

    //Get account balance of contract
    const bal = await aaveInteractions.getBalanceContract(process.env.CONTRACT_ADDRESS,process.env.USDC_CONTRACT_ADDRESS);
    console.log("Contract USDC balance: ",Number(bal));

    //get aToken balance of the contract
    const abal = await aaveInteractions.getBalanceContract(process.env.CONTRACT_ADDRESS,process.env.aUSDC_CONTRACT_ADDRESS);
    console.log("Contract aUSDC balance: ",Number(abal));

    //So principle + interest earned is getBalanceContract(contract_address,aDAI) and principle is poolValueAave(contract_address)
    //A subtraction will give me the amout that I have to withdraw and swap with uniswap

    const totalDeposit = await aaveInteractions.poolValueAave(process.env.USDC_CONTRACT_ADDRESS);

    //const num = ethers.BigNumber.from(abal);
    console.log("Type of abl: ",typeof abal);

    //Interest Calculation
    const intEarned = abal - totalDeposit;
    console.log("Interest Earned: ",intEarned);

    console.log("Withdrawing Interest to Contract...");
    const withdrawn = await aaveInteractions.withdrawLiquidityAave(intEarned,process.env.CONTRACT_ADDRESS,process.env.USDC_CONTRACT_ADDRESS);
    console.log("Amount Out: ",Number(withdrawn));

    const finalBal = await aaveInteractions.getBalanceContract(process.env.CONTRACT_ADDRESS,process.env.USDC_CONTRACT_ADDRESS);
    console.log("Contract USDC balance: ",Number(finalBal));

    //get aToken balance of the contract
    const afinalBal = await aaveInteractions.getBalanceContract(process.env.CONTRACT_ADDRESS,process.env.aUSDC_CONTRACT_ADDRESS);
    console.log("Contract aUSDC balance: ",Number(afinalBal));

    //await aaveInteractions.intSwap(finalBal);

    //const bct = await aaveInteractions.getBalanceContract(process.env.CONTRACT_ADDRESS,process.env.USDC_CONTRACT_ADDRESS);
    //console.log("Contract balance: ",Number(finalBal));



    //Get aave data for contract
    /*
    const data = await aaveInteractions.getContractDataAave(process.env.CONTRACT_ADDRESS);
    console.log("totalCollateralBase:", Number(data[0]));
    console.log("totalDebtBase:", Number(data[1]));
    console.log("availableBorrowsBase:", Number(data[2]));
    console.log("currentLiquidationThreshold:", Number(data[3]));
    console.log("ltv:", Number(data[4]));
    console.log("healthFactor:", Number(data[5]));
    */

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });