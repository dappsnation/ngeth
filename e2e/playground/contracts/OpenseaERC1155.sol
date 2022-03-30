// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OpenseaERC1155 is ERC1155, Ownable {
  string public contractURI;
  
  constructor(
    string memory _contractURI,
    string memory _tokenURI
  ) ERC1155(_tokenURI) {
    contractURI = _contractURI;
  }

  function setContractURI(string memory newuri) public onlyOwner {
    contractURI = newuri;
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