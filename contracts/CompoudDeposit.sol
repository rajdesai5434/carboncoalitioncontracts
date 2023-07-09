// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CompoundDeposit {
    address public constant COMPOUND_CDAI_ADDRESS = 0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643; // Replace with the cDAI address
    address public constant COMPOUND_COMPTROLLER_ADDRESS = 0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B; // Replace with the Comptroller address
    string public constant ALCHEMY_URL = "<your_Alchemy_URL>"; // Replace with your Alchemy URL

    function depositToCompound(uint256 _amount) external {
        // Get the DAI token address
        address daiToken = 0x6B175474E89094C44Da98b954EedeAC495271d0F; // Replace with the DAI token address
        
        // Approve the transfer of DAI tokens to the Compound contract
        IERC20(daiToken).approve(COMPOUND_CDAI_ADDRESS, _amount);
        
        // Enter the market by calling the Comptroller contract
        address[] memory cTokens = new address[](1);
        cTokens[0] = COMPOUND_CDAI_ADDRESS;
        IComptroller(COMPOUND_COMPTROLLER_ADDRESS).enterMarkets(cTokens);
        
        // Deposit DAI tokens into Compound
        ICErc20 cToken = ICErc20(COMPOUND_CDAI_ADDRESS);
        require(cToken.mint(_amount) == 0, "Minting failed");
    }
}

interface ICErc20 {
    function mint(uint256 mintAmount) external returns (uint256);
}

interface IComptroller {
    function enterMarkets(address[] calldata cTokens) external returns (uint256[] memory);
}
