// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

interface IERC20 {
  function balanceOf(address account) external view returns (uint256);
  function transfer(address recipient, uint256 amount) external returns (bool);
  function approve(address spender, uint256 amount) external returns (bool);
}


contract UniswapInteractions {
  address public constant routerAddress = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
  ISwapRouter public immutable swapRouter = ISwapRouter(routerAddress);

  address public constant WETH = 0xD087ff96281dcf722AEa82aCA57E8545EA9e6C96;
  address public constant WMATIC = 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889;

  IERC20 public wethToken = IERC20(WETH);

  // For this example, we will set the pool fee to 0.05%.
  uint24 public constant poolFee = 500;

  constructor() {}

  function swapExactInputSingle(uint256 amountIn) external returns (uint256 amountOut)
  {
    wethToken.approve(address(swapRouter), amountIn);

    ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
    .ExactInputSingleParams({
      tokenIn: WETH,
      tokenOut: WMATIC,
      fee: poolFee,
      recipient: address(this),
      deadline: block.timestamp,
      amountIn: amountIn,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0
    });

    amountOut = swapRouter.exactInputSingle(params);
  }
}
