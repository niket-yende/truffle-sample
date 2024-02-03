// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BatchTransfer is Ownable {
    IERC20 public token;

    constructor(address _tokenAddress) Ownable(msg.sender) {
        token = IERC20(_tokenAddress);
    }

    function transferBatch(address[] calldata _to, uint256[] calldata _amounts) external onlyOwner {
        require(_to.length == _amounts.length, "Arrays length mismatch");

        for (uint256 i = 0; i < _to.length; i++) {
            require(token.balanceOf(address(this)) >= _amounts[i], "Insufficient balance");
            token.transfer(_to[i], _amounts[i]);
        }
    }
}