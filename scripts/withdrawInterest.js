const hre = require("hardhat");
require("dotenv-flow").config({
    silent: true
});

async function main() {
    console.log("Calculating Interest...");

    const [account] = await ethers.getSigners();
    console.log("Wallet Address:",account.address);

    const aaveInteractionsContract = require("../artifacts/contracts/AaveInteractions.sol/AaveInteractions.json");
    const aaveInteractions = new ethers.Contract(process.env.AAVE_CONTRACT_ADDRESS, aaveInteractionsContract.abi,account);
    console.log("AaveInteractions address:", await aaveInteractions.getAddress());

    const usdcCoin = new ethers.Contract(process.env.TOKEN_ADDRESS, process.env.TOKEN_ABI,account);
    console.log("TOKEN address:", await usdcCoin.getAddress());

    //Get account balance of contract
    const bal = await aaveInteractions.getBalanceContract(process.env.AAVE_CONTRACT_ADDRESS,process.env.TOKEN_ADDRESS);
    console.log("Contract TOKEN balance: ",Number(bal));

    //get aToken balance of the contract
    const abal = await aaveInteractions.getBalanceContract(process.env.AAVE_CONTRACT_ADDRESS,process.env.aTOKEN_ADDRESS);
    console.log("Contract aTOKEN balance: ",Number(abal));

    //So principle + interest earned is getBalanceContract(contract_address,aDAI) and principle is poolValueAave(contract_address)
    //A subtraction will give me the amout that I have to withdraw and swap with uniswap

    const totalDeposit = await aaveInteractions.poolValueAave(process.env.TOKEN_ADDRESS);
    console.log("Total Deposit: ", Number(totalDeposit));

    //Interest Calculation
    const intEarned = abal - totalDeposit;
    console.log("Interest Earned: ",Number(intEarned));

    const withdrawn = await aaveInteractions.withdrawLiquidityAave(intEarned,process.env.AAVE_CONTRACT_ADDRESS,process.env.TOKEN_ADDRESS);
    await withdrawn.wait();
    console.log("Amount Out: ",Number(withdrawn));

    const finalBal = await aaveInteractions.getBalanceContract(process.env.AAVE_CONTRACT_ADDRESS,process.env.TOKEN_ADDRESS);
    console.log("Contract TOKEN balance: ",Number(finalBal));

    //get aToken balance of the contract
    const afinalBal = await aaveInteractions.getBalanceContract(process.env.AAVE_CONTRACT_ADDRESS,process.env.aTOKEN_ADDRESS);
    console.log("Contract aTOKEN balance: ",Number(afinalBal));

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });