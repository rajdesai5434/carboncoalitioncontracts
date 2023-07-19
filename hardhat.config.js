require("@nomicfoundation/hardhat-toolbox");
require("dotenv-flow").config({
  silent: true
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    polygon: {
      url: process.env.ALCHEMY_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};