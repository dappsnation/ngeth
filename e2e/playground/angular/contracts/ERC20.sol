// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BaseERC20 is ERC20 {
  constructor() ERC20('Name', 'SYB') {
    _mint(msg.sender, 100 * 10 ** decimals());
  }
}