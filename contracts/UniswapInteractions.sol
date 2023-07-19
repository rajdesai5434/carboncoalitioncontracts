// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';


contract UniswapInteractions {
  ISwapRouter public immutable swapRouter;

  address public firstToken;
  address public secondToken;

  // For this example, we will set the pool fee to 0.3%.
  uint24 public constant poolFee = 3000;

  constructor(address inToken, address outToken, address routerAddress) {
    swapRouter = ISwapRouter(routerAddress);
    firstToken = inToken;
    secondToken = outToken;

  }

  function swapExactInputSingle(uint256 amountIn, address aaveContractAddress) external returns (uint256 amountOut)
  {
    TransferHelper.safeTransferFrom(firstToken, aaveContractAddress, address(this), amountIn);

    TransferHelper.safeApprove(firstToken, address(swapRouter), amountIn);

    ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
    .ExactInputSingleParams({
      tokenIn: firstToken,
      tokenOut: secondToken,
      fee: poolFee,
      recipient: address(this),
      deadline: block.timestamp,
      amountIn: amountIn,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0
    });

    amountOut = swapRouter.exactInputSingle(params);

    TransferHelper.safeApprove(secondToken, address(this), amountOut);

    TransferHelper.safeTransferFrom(secondToken, address(this), aaveContractAddress, amountOut);

  }
}
