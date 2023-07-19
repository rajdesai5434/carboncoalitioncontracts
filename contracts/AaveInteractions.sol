// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {IPoolDataProvider} from "@aave/core-v3/contracts/interfaces/IPoolDataProvider.sol";
import {UniswapInteractions} from  "./UniswapInteractions.sol";

contract AaveInteractions{
    address payable owner;

    IPoolAddressesProvider public immutable ADDRESSES_PROVIDER;
    IPool public immutable POOL;
    IPoolDataProvider public immutable POOL_DATA;
    UniswapInteractions public immutable UNI_CONTRACT;
    
    address private immutable tokenAddress = 0xD087ff96281dcf722AEa82aCA57E8545EA9e6C96;
    address private immutable aTokenAddress = 0xAA02A95942Cb7d48Ac8ad8C3b5D65E546eC3Ecd3;
    address private immutable poolAddress = 0xeb7A892BB04A8f836bDEeBbf60897A7Af1Bf5d7F;
    address private immutable uniContractAddress = 0x2065865839d7389acF33A96e1Fcb7E6B00eeBF4E;

    mapping(address => mapping(address => uint256)) public userAccBalContract;
    mapping(address => mapping(address => uint256)) public userAccBalAave;
    mapping(address => uint256) public poolValueAave;
    mapping(address => uint256) public poolValueToken;
    mapping(address => IERC20) private token;
    
    //mapping(address => IERC20) public allowedERC20;

    //based on interest accured, update poolValueAave


    constructor()
    {
        ADDRESSES_PROVIDER = IPoolAddressesProvider(poolAddress);
        POOL = IPool(ADDRESSES_PROVIDER.getPool());
        POOL_DATA = IPoolDataProvider(ADDRESSES_PROVIDER.getPool());
        owner = payable(msg.sender);
        token[tokenAddress] = IERC20(tokenAddress);
        token[aTokenAddress] = IERC20(aTokenAddress);
        UNI_CONTRACT = UniswapInteractions(uniContractAddress);
    }

    function allowedToken(address _tokenAddress) external 
    {
        require(msg.sender == owner, "Only owner can add allowed tokens");
        token[_tokenAddress] = IERC20(_tokenAddress);
    }

    
    function approveContractTransfer(uint256 _amount, address _tokenAddress) 
        external
        returns (bool)
    {
        return token[_tokenAddress].approve(address(this), _amount);
    }

    function allowanceContractTransfer(address _tokenAddress)
        external
        view
        returns (uint256)
    {   
        return token[_tokenAddress].allowance(msg.sender, address(this));
    }

    function depositToContract(uint256 _amount, address _tokenAddress) 
        external
        returns (bool)
    {   
        poolValueToken[_tokenAddress]+=_amount;
        userAccBalContract[msg.sender][_tokenAddress] += _amount;
        return token[_tokenAddress].transferFrom(msg.sender,address(this), _amount);
    }


    function approveAaveTransfer(uint256 _amount, address _poolContractAddress, address _tokenAddress)
        external
        returns (bool)
    {   
        return token[_tokenAddress].approve(_poolContractAddress, _amount);
    }

    function allowanceAaveTransfer(address _contractAddress, address _poolContractAddress,address _tokenAddress)
        external
        view
        returns (uint256)
    {   
        return token[_tokenAddress].allowance(_contractAddress, _poolContractAddress);
    }

    function supplyLiquidityAave(uint256 _amount, address _aTokenRecieverAddress, address _tokenAddress) 
        external 
    {
        address asset = _tokenAddress;
        uint256 amount = _amount;
        address onBehalfOf = _aTokenRecieverAddress;
        uint16 referralCode = 0;

        poolValueToken[_tokenAddress]-=_amount;
        poolValueAave[asset] += amount;

        POOL.supply(asset,amount,onBehalfOf,referralCode);
    }

    function getBalanceContract(address _contractAddress, address _tokenAddress) external view returns (uint256) {
        return token[_tokenAddress].balanceOf(_contractAddress);
    }

    function getContractDataAave(address _contractAddress) 
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
        return POOL.getUserAccountData(_contractAddress);
    }

    function withdrawLiquidityAave(uint256 _amount, address _contractAddress, address _tokenAddress) external 
        returns(uint256)
    {
        address asset = _tokenAddress;
        uint256 amount = _amount;
        address to = _contractAddress;

        poolValueToken[asset]+=_amount;
        poolValueAave[asset] -= amount;

        return POOL.withdraw(asset,amount,to);
    }

    function withdrawFromContract(uint256 _amount, address _tokenAddress) external onlyOwner {
        require(userAccBalContract[msg.sender][_tokenAddress] >= _amount);
        userAccBalContract[msg.sender][_tokenAddress] -= _amount;
        token[_tokenAddress].transferFrom(address(this),msg.sender, _amount);
    }

    function interestSwapApproval(uint256 _amount, address _tokenAddress) external returns (bool){

        return token[_tokenAddress].approve(uniContractAddress, _amount);
    }

    function interestSwapAllowance(address _tokenAddress)
        external
        view
        returns (uint256)
    {   
        return token[_tokenAddress].allowance(address(this), uniContractAddress);
    }

    function interestSwap(uint256 _amount) external returns (uint256){

        return UNI_CONTRACT.swapExactInputSingle(_amount,address(this));
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