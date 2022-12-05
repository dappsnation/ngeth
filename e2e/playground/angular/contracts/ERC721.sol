// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BaseERC721 is ERC721 {
  constructor() ERC721('MyToken', 'MTK') {
  }
}