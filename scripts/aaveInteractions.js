const hre = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("Supply to Aave..");

    const [account] = await ethers.getSigners();
    console.log("Wallet Address:",account.address);

    const aaveMarketInteractionsContract = require("../artifacts/contracts/AaveMarketInteractions.sol/AaveMarketInteractions.json");
    const aaveMarketInteractions = new ethers.Contract(process.env.MATIC_AAVE_CONTRACT_ADDRESS, aaveMarketInteractionsContract.abi, account);
    console.log("AaveMarketInteractions address:", await aaveMarketInteractions.getAddress());

    const usdcCoin = new ethers.Contract(process.env.USDC_CONTRACT_ADDRESS, process.env.USDC_CONTRACT_ABI, account);
    console.log("USDC address:", await usdcCoin.getAddress());

    //1. Approve transfer of money from wallet to contract
    const approve1 = await usdcCoin.connect(account).approve(await aaveMarketInteractions.getAddress(),10000000000,{gasLimit:1000000});
    await approve1.wait();
    console.log("Approval hash to send coins to contract: ", approve1.hash);

    //1.1 Move money from wallet to contract
    const transfer1 = await usdcCoin.connect(account).transfer(await aaveMarketInteractions.getAddress(),10000000000,{gasLimit:1000000});
    await transfer1.wait();
    console.log("Transfer hash of coins to contract: ", transfer1.hash);

    //2. Approve transfer of money from contract to aave
    const approve12 = await aaveMarketInteractions.approveUSDC(100000000,process.env.AAVE_POOL_ADDRESS_PROVIDER,{gasLimit:1000000});
    const allow1 = await aaveMarketInteractions.allowanceUSDC(process.env.AAVE_POOL_ADDRESS_PROVIDER,{gasLimit:1000000});
    console.log("Allowance: ",Number(allow1));
    

    //2.1 Move money from contract to aave
    await aaveMarketInteractions.supplyLiquidity(process.env.USDC_CONTRACT_ADDRESS,1000000,{gasLimit:1000000});

    console.log(await aaveMarketInteractions.getUserAccountData(account.address));





    //3. Mint interest from aavv

    /*
    console.log("USDC for contract address:",Number(await aaveMarketInteractions.getBalance("0xe9DcE89B076BA6107Bb64EF30678efec11939234")));

    const allowSuccess = await aaveMarketInteractions.allowanceUSDC("0xeb7A892BB04A8f836bDEeBbf60897A7Af1Bf5d7F");
    const approveSuccess = await aaveMarketInteractions.approveUSDC(BigInt("1000"),"0xeb7A892BB04A8f836bDEeBbf60897A7Af1Bf5d7F");

    console.log("Allowance Success:",await allowSuccess.wait());
    console.log("Approve Success:",await approveSuccess.wait());

    await aaveMarketInteractions.supplyLiquidity("0xe9DcE89B076BA6107Bb64EF30678efec11939234",BigInt("1000"));

    const userData = await getUserAccountData(account);

    console.log("User Data:",userData);
    */
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});