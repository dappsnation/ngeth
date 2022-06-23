// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @dev Implementation of the ERC1155 openzepplin class
contract BaseERC1155 is ERC1155, Ownable {

    constructor(string memory _uri) ERC1155(_uri) {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    /// @notice Mint a token
    /// @dev Mint a token
    /// @param account The address of the owner
    /// @param id TokenId
    /// @param amount the amount of tokens
    /// @custom:example
    /// ```typescript
    /// erc1155.mint(owner, 1, 10, '0x00')
    /// ```
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