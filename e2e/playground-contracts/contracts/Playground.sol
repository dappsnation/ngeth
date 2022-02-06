// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract Playground {
    function emitEvent(bytes32 _eventName, bool _isTrue) public {
        emit LogEvent(_eventName, _isTrue);
    }
    
    function emitEvent(bytes32 _eventName, address _account) public {
        emit LogEvent(_eventName, _account);
    }
    

    function getEvent(bytes32 _eventName) public pure {

    }

    function getEvent(address _account) public view returns (uint256) {
        return address(_account).balance;
    }

    event LogEvent(
        bytes32 eventName,
        bool isTrue
    );

    event LogEvent(
        bytes32 eventName,
        address account
    );
}