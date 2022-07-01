// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract UpgradeableERC1155 is ERC1155Upgradeable, OwnableUpgradeable {
  string public contractURI;

  function initialize(
    string memory _tokenURI
  ) public initializer {
    __Ownable_init();
    __ERC1155_init(_tokenURI);
  }

  function setURI(string memory newuri) public onlyOwner {
    _setURI(newuri);
  }

  function mint(address account, uint256 id, uint256 amount, bytes memory data)
    public
    onlyOwner
  {
    _mint(account, id, amount, data);
  }

  function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
    public
    onlyOwner
  {
    _mintBatch(to, ids, amounts, data);
  }
}