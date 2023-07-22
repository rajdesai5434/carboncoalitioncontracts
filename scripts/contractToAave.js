const hre = require("hardhat");
require("dotenv-flow").config({
  silent: true
});

async function main() {
    console.log("Supply to Aave..");

    const [account] = await ethers.getSigners();
    console.log("Wallet Address:",account.address);

    const aaveInteractionsContract = require("../artifacts/contracts/AaveInteractions.sol/AaveInteractions.json");
    const aaveInteractions = new ethers.Contract(process.env.AAVE_CONTRACT_ADDRESS, aaveInteractionsContract.abi,account);
    console.log("AaveInteractions address:", await aaveInteractions.getAddress());

    const token = new ethers.Contract(process.env.TOKEN_ADDRESS, process.env.TOKEN_ABI,account);
    console.log("TOKEN address:", await token.getAddress());

    //Get account balance of contract
    const bal = await token.balanceOf(process.env.AAVE_CONTRACT_ADDRESS);
    console.log("Contract TOKEN balance: ",Number(bal));
    
    const provider = ethers.provider;
    const fee = await provider.getFeeData();
    gasPrice = fee['gasPrice'];
    console.log("Gas Price: ",Number(gasPrice));

    const poolAddress = await aaveInteractions.POOL();
    console.log("Pool Address: ",poolAddress);

    const inputAmount = ethers.parseUnits('0.1',18);
    console.log("Approval Amount: ",Number(inputAmount));
    
    const approve1 = await aaveInteractions.approveAaveTransfer(inputAmount,poolAddress,process.env.TOKEN_ADDRESS,{gasPrice:gasPrice,gasLimit: 500000});
    await approve1.wait();
    console.log("Approval hash to send coins to Aave: ", approve1.hash);

    //Allowance  
    const allow1 = await aaveInteractions.allowanceAaveTransfer(process.env.AAVE_CONTRACT_ADDRESS,poolAddress,process.env.TOKEN_ADDRESS,{gasPrice:gasPrice,gasLimit: 500000});
    console.log("Allowance: ", Number(allow1));
    
    //1.1 Move money from contract to Aave
    const transfer1 = await aaveInteractions.supplyLiquidityAave(inputAmount,process.env.AAVE_CONTRACT_ADDRESS,process.env.TOKEN_ADDRESS,{gasPrice:gasPrice,gasLimit: 500000});
    await transfer1.wait();
    console.log("Transfer hash of coins to Aave: ", transfer1.hash);

    //get aToken balance of the contract
    const abal = await aaveInteractions.getBalanceContract(process.env.AAVE_CONTRACT_ADDRESS,process.env.aTOKEN_ADDRESS);
    console.log("Contract aTOKEN balance: ",Number(abal));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});