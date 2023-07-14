const { ethers } = require("hardhat");
const {getERC20Balance} = require('./helpers');
require("dotenv").config();

async function main() {
    console.log("Swapping tokens..");

    const [account] = await hre.ethers.getSigners();
    console.log("Wallet Address:",account.address);

    const provider = ethers.provider;

    const uniswapInteractionsContract = require("../artifacts/contracts/UniswapInteractions.sol/UniswapInteractions.json");
    const uniswapInteractions = new ethers.Contract(process.env.UNISWAP_CONTRACT_ADDRESS, uniswapInteractionsContract.abi, account);
    console.log("UniswapInteractions address:", await uniswapInteractions.getAddress());

    const wmaticBalance = await getERC20Balance(account.address,process.env.WMATIC_ADDRESS,provider)
    const bctBalance = await getERC20Balance(account.address,process.env.BCT_ADDRESS,provider)

    console.log("Wallet WMATIC balance:", Number(wmaticBalance));
    console.log("Wallet BCT balance:", Number(bctBalance));

    const wmaticContract = new ethers.Contract(
        process.env.WMATIC_ADDRESS,
        process.env.USDC_CONTRACT_ABI,
        provider
      )
    
      const singleSwap = new ethers.Contract(
        process.env.UNISWAP_CONTRACT_ADDRESS,
        uniswapInteractionsContract.abi,
        provider
      );
    
      const fee = await provider.getFeeData();
      gasPrice = fee['gasPrice'];
      console.log("Gas Price: ",Number(gasPrice));
    
      console.log("Getting ready for approval");

      const inputAmount = ethers.parseUnits('1',18);
    
      const firstApproval = await wmaticContract.connect(account).approve(
        await singleSwap.getAddress(),
        inputAmount,
        {gasPrice:gasPrice,gasLimit: 500000}
      )
      await firstApproval.wait()
      console.log("Approval Hash: ",firstApproval.hash);
    
      const outAmount = await singleSwap.swapExactInputSingle(
        inputAmount,
        {gasPrice:gasPrice,gasLimit: 500000}
      )
      await outAmount.wait()
      //console.log("Transfer Hash: ",outAmount);
    
      console.log("Amount Out:",Number(outAmount));


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });