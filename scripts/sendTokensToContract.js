const hre = require("hardhat");
require("dotenv-flow").config({
  silent: true
});

async function main() {
    console.log("Supply to Contract..");

    const [account] = await ethers.getSigners();
    console.log("Wallet Address:",account.address);

    const aaveInteractionsContract = require("../artifacts/contracts/AaveInteractions.sol/AaveInteractions.json");
    const aaveInteractions = new ethers.Contract(process.env.AAVE_CONTRACT_ADDRESS, aaveInteractionsContract.abi, account);
    console.log("AaveInteractions address:", await aaveInteractions.getAddress());

    const token = new ethers.Contract(process.env.TOKEN_ADDRESS, process.env.TOKEN_ABI, account);
    console.log("USDC address:", await token.getAddress());

    const provider = ethers.provider;
    const fee = await provider.getFeeData();
    gasPrice = fee['gasPrice'];
    console.log("Gas Price: ",Number(gasPrice));

    //Get account balance of contract
    const abal = await aaveInteractions.getBalanceContract(account.address,process.env.TOKEN_ADDRESS);
    console.log("User USDC balance: ",Number(abal));

    const inputAmount = ethers.parseUnits('0.1',18);
    console.log("Approval Amount: ",Number(inputAmount));

    //1. Approve transfer of money from wallet to contract
    const approve1 = await token.approve(process.env.AAVE_CONTRACT_ADDRESS,inputAmount,{gasPrice:gasPrice,gasLimit: 500000});
    await approve1.wait();
    console.log("Approval hash to send coins to contract: ", approve1.hash);

    const allow1 = await token.allowance(account.address,process.env.AAVE_CONTRACT_ADDRESS,{gasPrice:gasPrice,gasLimit: 500000});
    console.log("Allowance: ", Number(allow1));

    //1.1 Move money from wallet to contract
    const transfer1 = await aaveInteractions.depositToContract(inputAmount,process.env.TOKEN_ADDRESS,{gasPrice:gasPrice,gasLimit: 500000});
    await transfer1.wait();
    console.log("Transfer hash of coins to contract: ", transfer1.hash);

    //Get account balance of contract
    const bal = await aaveInteractions.getBalanceContract(process.env.AAVE_CONTRACT_ADDRESS,process.env.TOKEN_ADDRESS);
    console.log("Contract USDC balance: ",Number(bal));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});