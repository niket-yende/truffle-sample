// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract TestContract {
    address private immutable owner;
    // making contract as singleton
    bool private immutable initialized;
    uint internal balance;

    event UpdateBalance(address _owner, uint _balance);

    constructor() {
        owner = msg.sender;
        initialized = true;
    }

    modifier isInitialized () {
        require(!initialized, "Already initialized contract");
        _;
    }

    modifier onlyOnwer() {
        require(owner == msg.sender, "Not an owner");
        _;
    }

    function setBalance(uint _balance) external onlyOnwer {
        require(_balance > 0, "Balance must be greater than 0");
        balance = _balance;
        emit UpdateBalance(msg.sender, _balance);
    }

    function getBalance() public view returns (uint) {
        return balance;
    }

    function getView() public pure returns (bytes32) {
        return "This is a test view";
    } 
}