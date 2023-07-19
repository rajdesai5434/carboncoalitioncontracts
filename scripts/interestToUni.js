const hre = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("Swapping Interest for Carbon Tokens...");

    const [account] = await ethers.getSigners();
    console.log("Wallet Address:",account.address);

    const provider = ethers.provider;

    const aaveInteractionsContract = require("../artifacts/contracts/AaveInteractions.sol/AaveInteractions.json");
    const aaveInteractions = new ethers.Contract(process.env.AAVE_CONTRACT_ADDRESS, aaveInteractionsContract.abi,account);
    console.log("AaveInteractions address:", await aaveInteractions.getAddress());

    const uniswapInteractionsContract = require("../artifacts/contracts/UniswapInteractions.sol/UniswapInteractions.json");
    const uniswapInteractions = new ethers.Contract(process.env.UNISWAP_CONTRACT_ADDRESS, uniswapInteractionsContract.abi, account);
    console.log("UniswapInteractions address:", await uniswapInteractions.getAddress());

    const usdcCoin = new ethers.Contract(process.env.USDC_CONTRACT_ADDRESS, process.env.USDC_CONTRACT_ABI,account);
    console.log("USDC address:", await usdcCoin.getAddress());

    const fee = await provider.getFeeData();
    gasPrice = fee['gasPrice'];
    console.log("Gas Price: ",Number(gasPrice));
    
    console.log("Getting ready for approval");

    const firstApproval = await usdcCoin.connect(account).approve(await uniswapInteractions.getAddress(),inputAmount,{gasPrice:gasPrice,gasLimit: 500000})
    await firstApproval.wait();
    console.log("Approval hash to send coins to contract: ", firstApproval.hash);

    const firstAllow = await usdcCoin.allowance(account.address,process.env.AAVE_CONTRACT_ADDRESS,{gasLimit:1000000});
    console.log("Allowance: ", Number(firstAllow));

    const outAmount = await uniswapInteractions.swapExactInputSingle(inputAmount,{gasPrice:gasPrice,gasLimit: 500000});
    await outAmount.wait();
    
    const bctBalance2 = await getERC20Balance(account.address,process.env.BCT_ADDRESS,provider);
    console.log("Wallet BCT balance:", Number(bctBalance2));


}