// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";

struct Offer {
  uint256 amount;
  uint256 price;
  bytes data;
}

// TODO
// 1. Verify interfaces with https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified
// 2. Improve payment with https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/ 
// 3. Check what happens if owner already sold on another market


contract Market {

  event UpsertOffer(address indexed contractAddress, address indexed from, uint256 indexed tokenId, uint256 amount, uint256 price, bytes data);
  event CancelOffer(address indexed contractAddress, address indexed from, uint256 indexed tokenId);
  event AcceptOffer(address indexed contractAddress, address indexed from, uint256 indexed tokenId, address to, uint256 amount, uint256 price, bytes data);

  mapping(address => mapping(address => mapping(uint256 => Offer))) public offers;

  using SafeMath for uint;

  // Create or update an offer
  function upsertOffer(
    address contractAddress,
    uint256 tokenId,
    uint256 amount,
    uint256 price,
    bytes calldata data
  ) public {
    IERC1155 erc1155 = IERC1155(address(contractAddress));
    require(amount != 0);
    require(price != 0);
    require(erc1155.isApprovedForAll(msg.sender, address(this)), 'Market contract should be approve for all');
    require(erc1155.balanceOf(msg.sender, tokenId) >= amount);
    offers[contractAddress][msg.sender][tokenId] = Offer(amount, price, data);
    emit UpsertOffer(contractAddress, msg.sender, tokenId, amount, price, data);
  }

  // Delete an existing offer
  function cancelOffer(address contractAddress, uint256 tokenId) public {
    delete offers[contractAddress][msg.sender][tokenId];
    emit CancelOffer(contractAddress, msg.sender, tokenId);
  }

  /// @notice Accept an offer for yourself or someone else
  /// @param contractAddress The address of the ERC1155
  /// @param from The address that created the offer
  /// @param to The address to send the tokens to (usually same as msg.sender)
  /// @param tokenId The id of the token
  /// @param amount The amount of token to transfer
  function acceptOffer(
    address contractAddress,
    address payable from,
    address to,
    uint256 tokenId,
    uint256 amount
  ) payable public {
    require(amount > 0);
    IERC1155 erc1155 = IERC1155(address(contractAddress));
    require(erc1155.balanceOf(from, tokenId) >= amount);
    Offer storage offer = offers[contractAddress][from][tokenId];
    require(offer.amount >= amount);
    require(offer.price.mul(amount) == msg.value);

    if (offer.amount == amount) {
      delete offers[contractAddress][from][tokenId];
    } else {
      offer.amount = offer.amount.sub(amount);
    }
    erc1155.safeTransferFrom(from, to, tokenId, amount, offer.data);
    Address.sendValue(from, msg.value);
    emit AcceptOffer(contractAddress, from, tokenId, to, amount, offer.price, offer.data);
  }
}