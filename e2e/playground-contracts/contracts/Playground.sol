// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Playground {
    uint256 public total;
    mapping(address => uint256) public contributions;
    address[] private participants;

    event Contribution(address indexed from, uint256 indexed amount);

    using SafeMath for uint;

    constructor() {}

    function contribute() public payable {
        require(msg.value > 0, 'Send more than 0 Wei');
        if (contributions[msg.sender] == uint256(0)) {
            participants.push(msg.sender);
        } 
        total += msg.value;
        contributions[msg.sender] += msg.value;
        emit Contribution(msg.sender, msg.value);
    }

    function retrieve() public {
        for (uint8 i = 0; 0 < participants.length; i++) {
            address payable participant = payable(participants[i]);
            uint256 contribution = contributions[participant];
            uint256 balance = address(this).balance;
            participant.transfer(contribution.mul(balance).div(total));
        }
    }
}
