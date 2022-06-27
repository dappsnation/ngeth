// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "./UpgradeableERC1155.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract ERC1155Proxy {
  address implementation; // Do not use "immutable" because

  /// @dev Emit when the bae contrat has been cloned
  /// @param from account which cloned the contract
  /// @param clone address of the cloned contract
  event Clone(address indexed from, address indexed clone);

  constructor() {
    implementation = address(new UpgradeableERC1155());
  }

  function create(string memory _tokenURI) public returns(address) {
    address clone = Clones.clone(implementation);
    UpgradeableERC1155(clone).initialize(_tokenURI);
    UpgradeableERC1155(clone).transferOwnership(msg.sender);
    emit Clone(msg.sender, clone);
    return clone;
  }
}