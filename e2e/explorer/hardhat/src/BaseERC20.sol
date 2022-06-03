// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BaseERC20 is ERC20 {
  constructor(string memory _name) ERC20(_name, 'SYB') {
    _mint(msg.sender, 100 * 10 ** decimals());
  }
}