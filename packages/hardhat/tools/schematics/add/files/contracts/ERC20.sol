// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// This is an example of contract

contract <%= className %> is ERC20 {
  constructor(string memory name, string memory symbol) ERC20(name, symbol) {}
}
