// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MultiSigWallet is ReentrancyGuard{
    address[] public owners;
    uint public immutable requiredConfirmations;

    struct Transaction {
        address to;
        uint value;
        bool executed;
    }

    Transaction[] public transactions;
    mapping(uint => mapping(address => bool)) isConfirmed;
    mapping(address => bool) isOwner;

    event TransactionSubmitted(uint _transactionId, address _sender, address _receiver, uint _amount);
    event TransactionConfirmed(uint _transactionId);
    event TransactionExecuted(uint _transactionId);

    modifier onlyOwner() {
        require(isOwner[msg.sender], 'Owner required');
        _;
    }

    constructor(address[] memory _owners, uint _requiredConfirmations) {
        require(_owners.length > 1, 'Owners must be more than 1');
        require(_requiredConfirmations > 0 && _requiredConfirmations <= _owners.length, 'Required confirmations not in sync with no. of owners');

        for (uint i = 0; i < _owners.length; i++) {
            require(_owners[i] != address(0), 'Invalid owner address');
            require(!isOwner[_owners[i]], 'Owner address already added');
            owners.push(_owners[i]);
            isOwner[_owners[i]] = true;
        }

        requiredConfirmations = _requiredConfirmations;
    }

    function submitTransaction(address _to) public payable onlyOwner {
        require(_to != address(0), 'Invalid receiver address');
        require(msg.value > 0, 'Transfer amount has to be greater than 0');

        uint transactionId = transactions.length + 1;
        transactions.push(Transaction({to: _to, value: msg.value, executed: false}));
        emit TransactionSubmitted(transactionId, msg.sender, _to, msg.value);
    }

    function confirmTransaction(uint _transactionId) public onlyOwner {
        require(_transactionId <= transactions.length, 'Invalid transaction id');
        require(!isConfirmed[_transactionId][msg.sender], 'Already confirmed by the owner');
        isConfirmed[_transactionId][msg.sender] = true;
        emit TransactionConfirmed(_transactionId);
    }

    function executeTransaction(uint _transactionId) public payable onlyOwner nonReentrant {
        require(_transactionId <= transactions.length, 'Invalid transaction id');
        uint transactionIndex = _transactionId - 1;
        require(!transactions[transactionIndex].executed, 'Transaction is already executed');
        require(isTransactionConfirmed(_transactionId), 'Required confirmations not attained');

        transactions[transactionIndex].executed = true;

        (bool success,) = transactions[transactionIndex].to.call{value: transactions[transactionIndex].value}("");
        require(success, 'Transaction execution failed');
        
        emit TransactionExecuted(_transactionId);
    }

    function isTransactionConfirmed(uint _transactionId) internal view returns (bool) {
        require(_transactionId <= transactions.length, 'Invalid transaction id');
        uint confirmationCount = 0;
        for (uint i = 0; i < owners.length; i++) {
            if(isConfirmed[_transactionId][owners[i]]) {
                confirmationCount++;
            }
        }

        return confirmationCount >= requiredConfirmations;
    }
}