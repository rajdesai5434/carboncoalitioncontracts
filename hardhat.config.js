require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    test: {
      url: process.env.ALCHEMY_MUMBAI_ENDPOINT,
      accounts: [process.env.MAIN_PRIVATE_KEY],
    },
    main:{
      url:process.env.ALCHEMY_POLYGON_ENDPOINT,
      accounts: [process.env.MAIN_PRIVATE_KEY],
    }
  },
};