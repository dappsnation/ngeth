// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "./OpenseaERC1155.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract ERC1155Factory {
  address immutable implementation;

  event Clone(address indexed from, address indexed clone);

  constructor() {
    implementation = address(new OpenseaERC1155());
  }

  function create(
    string memory _contractURI,
    string memory _tokenURI
  ) public returns(address) {
    address clone = Clones.clone(implementation);
    OpenseaERC1155(clone).initialize(_contractURI, _tokenURI);
    OpenseaERC1155(clone).transferOwnership(msg.sender);
    emit Clone(msg.sender, clone);
    return clone;
  }
}