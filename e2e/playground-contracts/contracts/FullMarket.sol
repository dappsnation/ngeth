// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC777/IERC777.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";

struct FungibleOffer {
  uint256 amount;
  uint256 price;
  bytes data;
}

// TODO
// 1. Verify interfaces with https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified
// 2. Improve payment with https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/ 
// 3. Check what happens if owner already sold on another market




contract FullMarket {

  // ERC777
  event ERC777UpsertOffer(address indexed contractAddress, address indexed from, uint256 amount, uint256 price, bytes data);
  event ERC777CancelOffer(address indexed contractAddress, address indexed from);
  event ERC777AcceptOffer(address indexed contractAddress, address indexed from, address indexed to, uint256 amount, uint256 price, bytes data);
  // ERC721
  event ERC721CreateOffer(address indexed contractAddress, address indexed from, uint256 indexed tokenId, uint256 price);
  event ERC721CancelOffer(address indexed contractAddress, address indexed from, uint256 indexed tokenId);
  event ERC721AcceptOffer(address indexed contractAddress, address indexed from, uint256 indexed tokenId, address to, uint256 price);
  // ERC1155
  event ERC1155UpsertOffer(address indexed contractAddress, address indexed from, uint256 indexed tokenId, uint256 amount, uint256 price, bytes data);
  event ERC1155CancelOffer(address indexed contractAddress, address indexed from, uint256 indexed tokenId);
  event ERC1155AcceptOffer(address indexed contractAddress, address indexed from, uint256 indexed tokenId, address to, uint256 amount, uint256 price, bytes data);



  // contract => owner => offer
  mapping(address => mapping(address => FungibleOffer)) public erc777Offers;
  // contract => tokenId => price
  mapping(address => mapping(uint256 => uint256)) public erc721Offers;
  // contract => owner => tokenId => offer
  mapping(address => mapping(address => mapping(uint256 => FungibleOffer))) public erc1155Offers;

  using SafeMath for uint;


  ////////////
  // ERC777 //
  ////////////

  // Create or update an offer
  function erc777UpsertOffer(
    address contractAddress,
    uint256 amount,
    uint256 price,
    bytes calldata data
  ) public {
    IERC777 erc777 = IERC777(address(contractAddress));
    require(amount != 0);
    require(price != 0);
    require(erc777.balanceOf(msg.sender).sub(amount) >= 0);
    erc777Offers[contractAddress][msg.sender] = FungibleOffer(amount, price, data);
    emit ERC777UpsertOffer(contractAddress, msg.sender, amount, price, data);
  }

  // Delete an existing offer
  function erc777CancelOffer(address contractAddress) public {
    delete erc777Offers[contractAddress][msg.sender];
    emit ERC777CancelOffer(contractAddress, msg.sender);
  }

  /// @notice Accept an offer for yourself or someone else
  /// @param contractAddress The address of the ERC777
  /// @param from The address that created the offer
  /// @param to The address to send the tokens to (usually same as msg.sender)
  /// @param amount The amount of token to transfer
  function erc777AcceptOffer(
    address contractAddress,
    address payable from,
    address to,
    uint256 amount
  ) payable public {
    FungibleOffer storage offer = erc777Offers[contractAddress][from];
    IERC777 erc777 = IERC777(address(contractAddress));
    require(amount > 0);
    require(offer.amount >= amount);
    require(erc777.balanceOf(from) >= amount);
    require(offer.price.mul(amount) == msg.value);

    if (offer.amount == amount) {
      delete erc777Offers[contractAddress][from];
    } else {
      offer.amount = offer.amount.sub(amount);
    }
    erc777.operatorSend(from, to, amount, offer.data, '');
    Address.sendValue(from, msg.value);
    emit ERC777AcceptOffer(contractAddress, from, to, amount, offer.price, offer.data);
  }

  ////////////
  // ERC721 //
  ////////////
  function erc721CreateOffer(address contractAddress, uint256 tokenId, uint256 price) public {
    IERC721 erc721 = IERC721(address(contractAddress));
    require(erc721.ownerOf(tokenId) == msg.sender);
    erc721Offers[contractAddress][tokenId] = price;
    emit ERC721CreateOffer(contractAddress, msg.sender, tokenId, price);
  }

  function erc721CancelOffer(address contractAddress, uint256 tokenId) public {
    IERC721 erc721 = IERC721(address(contractAddress));
    require(erc721.ownerOf(tokenId) == msg.sender);
    delete erc721Offers[contractAddress][tokenId];
    emit ERC721CancelOffer(contractAddress, msg.sender, tokenId);
  }

  /// @notice Accept an offer for yourself or someone else
  /// @param contractAddress The address of the ERC721
  /// @param tokenId The id of the token to buy
  /// @param to The address to send the token to (usually same as msg.sender)
  function erc721AcceptOffer(address contractAddress, uint256 tokenId, address to) payable public {
    require(erc721Offers[contractAddress][tokenId] == msg.value);
    IERC721 erc721 = IERC721(address(contractAddress));
    address payable owner = payable(erc721.ownerOf(tokenId));
    delete erc721Offers[contractAddress][tokenId];
    Address.sendValue(owner, msg.value);
    erc721.safeTransferFrom(owner, to, tokenId);
  }

  /////////////
  // ERC1155 //
  /////////////

  // Create or update an offer
  function erc1155UpsertOffer(
    address contractAddress,
    uint256 tokenId,
    uint256 amount,
    uint256 price,
    bytes calldata data
  ) public {
    IERC1155 erc1155 = IERC1155(address(contractAddress));
    require(amount != 0);
    require(price != 0);
    require(erc1155.balanceOf(msg.sender, tokenId).sub(amount) >= 0);
    erc1155Offers[contractAddress][msg.sender][tokenId] = FungibleOffer(amount, price, data);
    emit ERC1155UpsertOffer(contractAddress, msg.sender, tokenId, amount, price, data);
  }

  // Delete an existing offer
  function erc1155CancelOffer(address contractAddress, uint256 tokenId) public {
    delete erc1155Offers[contractAddress][msg.sender][tokenId];
    emit ERC1155CancelOffer(contractAddress, msg.sender, tokenId);
  }

  /// @notice Accept an offer for yourself or someone else
  /// @param contractAddress The address of the ERC1155
  /// @param from The address that created the offer
  /// @param to The address to send the tokens to (usually same as msg.sender)
  /// @param tokenId The id of the token
  /// @param amount The amount of token to transfer
  function erc1155AcceptOffer(
    address contractAddress,
    address payable from,
    address to,
    uint256 tokenId,
    uint256 amount
  ) payable public {
    require(amount > 0);
    IERC1155 erc1155 = IERC1155(address(contractAddress));
    require(erc1155.balanceOf(from, tokenId) >= amount);
    FungibleOffer storage offer = erc1155Offers[contractAddress][from][tokenId];
    require(offer.amount >= amount);
    require(offer.price.mul(amount) == msg.value);

    if (offer.amount == amount) {
      delete erc1155Offers[contractAddress][from][tokenId];
    } else {
      offer.amount = offer.amount.sub(amount);
    }
    erc1155.safeTransferFrom(from, to, tokenId, amount, offer.data);
    Address.sendValue(from, msg.value);
    emit ERC1155AcceptOffer(contractAddress, from, tokenId, to, amount, offer.price, offer.data);
  }
}