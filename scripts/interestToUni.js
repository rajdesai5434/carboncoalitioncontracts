const hre = require("hardhat");
require("dotenv").config();
const {getERC20Balance} = require('./helpers');

async function main() {
    console.log("Swapping Interest for Carbon Tokens...");

    const [account] = await ethers.getSigners();
    console.log("Wallet Address:",account.address);

    const aaveInteractionsContract = require("../artifacts/contracts/AaveInteractions.sol/AaveInteractions.json");
    const aaveInteractions = new ethers.Contract(process.env.AAVE_CONTRACT_ADDRESS, aaveInteractionsContract.abi,account);
    console.log("AaveInteractions address:", await aaveInteractions.getAddress());

    const uniswapInteractionsContract = require("../artifacts/contracts/UniswapInteractions.sol/UniswapInteractions.json");
    const uniswapInteractions = new ethers.Contract(process.env.UNI_CONTRACT_ADDRESS, uniswapInteractionsContract.abi, account);
    console.log("UniswapInteractions address:", await uniswapInteractions.getAddress());

    const carbonCreditInteractions = new ethers.Contract(process.env.CARBON_CREDIT_ADDRESS,process.env.CARBON_CREDIT_ABI, account);
    console.log("Carbon Credit address:", await carbonCreditInteractions.getAddress());
    
    const token = new ethers.Contract(process.env.TOKEN_ADDRESS, process.env.TOKEN_ABI,account);
    console.log("USDC address:", await token.getAddress());

    const provider = ethers.provider;
    const fee = await provider.getFeeData();
    gasPrice = fee['gasPrice'];
    console.log("Gas Price: ",Number(gasPrice));

    const finalBal = await aaveInteractions.getBalanceContract(process.env.AAVE_CONTRACT_ADDRESS,process.env.TOKEN_ADDRESS);
    console.log("USDC balance to swap: ",Number(finalBal));

    const bal = await carbonCreditInteractions.balanceOf(process.env.AAVE_CONTRACT_ADDRESS);
    console.log("Wallet Carbon Token Balance:", Number(bal));
    
    console.log("Getting ready for approval");

    const approve = await aaveInteractions.interestSwapApproval(finalBal,process.env.TOKEN_ADDRESS);
    await approve.wait();
    console.log("Approval hash to send coins to contract: ", approve.hash);

    const allow = await aaveInteractions.interestSwapAllowance(process.env.TOKEN_ADDRESS);
    console.log("Allowance: ", Number(allow));

    const amt = await aaveInteractions.interestSwap(finalBal,{gasPrice:gasPrice,gasLimit: 500000});
    await amt.wait();
    console.log("Swapping hash: ",amt.hash)
    
    const abal = await carbonCreditInteractions.balanceOf(process.env.AAVE_CONTRACT_ADDRESS);
    console.log("Wallet Carbon Token Balance:", Number(abal));


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });