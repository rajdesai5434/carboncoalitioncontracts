// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";


contract UniswapInteractions {
  address public constant routerAddress = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
  ISwapRouter public immutable swapRouter = ISwapRouter(routerAddress);

  address public constant DAI = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;
  address public constant BCT = 0x2F800Db0fdb5223b3C3f354886d907A671414A7F;

  IERC20 public daiToken = IERC20(DAI);

  // For this example, we will set the pool fee to 0.05%.
  uint24 public constant poolFee = 3000;

  constructor() {}

  function swapExactInputSingle(uint256 amountIn) external returns (uint256 amountOut)
  {
    TransferHelper.safeTransferFrom(DAI, msg.sender, address(this), amountIn);

    TransferHelper.safeApprove(DAI, address(swapRouter), amountIn);

    ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
    .ExactInputSingleParams({
      tokenIn: DAI,
      tokenOut: BCT,
      fee: poolFee,
      recipient: address(this),
      deadline: block.timestamp,
      amountIn: amountIn,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0
    });

    amountOut = swapRouter.exactInputSingle(params);

    TransferHelper.safeApprove(BCT, address(this), amountOut);

    TransferHelper.safeTransferFrom(BCT, address(this), msg.sender, amountOut);

  }
}
