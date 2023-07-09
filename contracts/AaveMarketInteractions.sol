// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";

contract AaveMarketInteractions{
    address payable owner;

    IPoolAddressesProvider public immutable ADDRESSES_PROVIDER;
    IPool public immutable POOL;
    
    address private immutable usdcAddress = 0xe9DcE89B076BA6107Bb64EF30678efec11939234;
    address private immutable poolAddress = 0xeb7A892BB04A8f836bDEeBbf60897A7Af1Bf5d7F;

    IERC20 private usdc;

    constructor()
    {
        ADDRESSES_PROVIDER = IPoolAddressesProvider(poolAddress);
        POOL = IPool(ADDRESSES_PROVIDER.getPool());
        owner = payable(msg.sender);
        usdc = IERC20(usdcAddress);

    }

    function supplyLiquidity(address _tokenAddress, uint256 _amount) 
        external 
    {
        address asset = _tokenAddress;
        uint256 amount = _amount;
        address onBehalfOf = address(this);
        uint16 referralCode = 0;

        POOL.supply(asset,amount,onBehalfOf,referralCode);
    }

    function withdrawLiquidity(address _tokenAddress, uint256 _amount) external 
        returns(uint256)
    {
        address asset = _tokenAddress;
        uint256 amount = _amount;
        address to = address(this);

        return POOL.withdraw(asset,amount,to);
        
    }

    function getUserAccountData(address _userAddress) 
        external 
        view 
        returns(
            uint256 totalCollateralBase,
            uint256 totalDebtBase,
            uint256 availableBorrowsBase,
            uint256 currentLiquidationThreshold,
            uint256 ltv,
            uint256 healthFactor
        )
    {
        return POOL.getUserAccountData(_userAddress);
    }

    function approveUSDC(uint256 _amount, address _poolContractAddress)
        external
        returns (bool)
    {
        return usdc.approve(_poolContractAddress, _amount);
    }

    function allowanceUSDC(address _poolContractAddress)
        external
        view
        returns (uint256)
    {
        return usdc.allowance(address(this), _poolContractAddress);
    }

    function getBalance(address _tokenAddress) external view returns (uint256) {
        return IERC20(_tokenAddress).balanceOf(address(this));
    }

    function withdraw(address _tokenAddress) external onlyOwner {
        IERC20 token = IERC20(_tokenAddress);
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function"
        );
        _;
    }

    receive() external payable {}
}