const { ethers } = require('ethers');

// Replace with your Alchemy API URL and API key
const alchemyAPIURL = '<your_Alchemy_API_URL>';
const alchemyAPIKey = '<your_Alchemy_API_Key>';

// Infura provider for connecting to the Ethereum network
const provider = new ethers.providers.InfuraProvider('mainnet', '<your_Infura_Project_ID>');

// Wallet connected to the Ethereum network
const wallet = new ethers.Wallet('<your_private_key>', provider);

// CompoundDeposit contract address
const compoundDepositAddress = '<your_CompoundDeposit_contract_address>';

// CompoundDeposit contract ABI
const compoundDepositABI = [
  // Paste the ABI of the CompoundDeposit contract here
];

// DAI token address
const daiTokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'; // Replace with the DAI token address

// DAI token ABI
const daiTokenABI = [
  // Paste the ABI of the DAI token contract here
];

// Amount to deposit in DAI
const depositAmount = ethers.utils.parseEther('1'); // Change the deposit amount as needed

async function depositToCompound() {
  // Create an instance of the CompoundDeposit contract
  const compoundDepositContract = new ethers.Contract(compoundDepositAddress, compoundDepositABI, wallet);

  // Create an instance of the DAI token contract
  const daiTokenContract = new ethers.Contract(daiTokenAddress, daiTokenABI, wallet);

  // Approve the transfer of DAI tokens to the Compound contract
  await daiTokenContract.approve(compoundDepositAddress, depositAmount);

  // Deposit DAI tokens into Compound
  const transaction = await compoundDepositContract.depositToCompound(daiTokenAddress, depositAmount);
  await transaction.wait();

  console.log('Deposit successful!');
}

async function main() {
  // Set up Alchemy as the provider
  const alchemyProvider = new ethers.providers.AlchemyProvider('mainnet', alchemyAPIKey, alchemyAPIURL);
  const alchemyWallet = wallet.connect(alchemyProvider);

  // Override the wallet provider to use Alchemy
  compoundDepositABI.provider = alchemyWallet.provider;

  // Execute the depositToCompound function
  await depositToCompound();

  // Disconnect from the provider
  alchemyWallet.provider.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
