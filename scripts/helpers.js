const {ethers} = require('ethers');
require("dotenv").config();

exports.getERC20Balance = async (walletAddress,erc20TokenAddress,provider) => {

  const tokenContract = new ethers.Contract(
    erc20TokenAddress,
    process.env.USDC_CONTRACT_ABI,
    provider
  )
  return tokenContract.balanceOf(walletAddress)
}
