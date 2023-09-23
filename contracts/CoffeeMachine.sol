// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


/**
    Implement a smart contract for a coffee machine.
    User should be able to pay the bill raised through the buyCoffee function.
    Formulas: normal price = (milkPerc * milkUnitPrice) + (concPerc * concUnitPrice) + cupPrice
              refill price = (milkPerc * milkUnitPrice) + (concPerc * concUnitPrice)
    Other requirements: owner should be able to set the milkUnitPrice, concUnitPrice & cupPrice
    function buyCoffee should check if the combination of milkPerc & concPerc adds up to 100
 */
contract COffeeMachine {
    address private immutable owner;
    uint private milkUnitPrice;
    uint private concUnitPrice;
    uint private cupPrice;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Only owner can invoke!");
        _;
    }

    function init(uint _milkUnitPrice, uint _concUnitPrice, uint _cupPrice) public onlyOwner {
        milkUnitPrice = _milkUnitPrice;
        concUnitPrice = _concUnitPrice;
        cupPrice = _cupPrice;
    }

    function buyCoffee(uint _percMilk, uint _percConc, bool isRefill) external view returns (uint) {
        uint totalPerc = _percMilk + _percConc;
        require(totalPerc <= 100, "Total quantities must be within the limit");

        // local cache
        uint _milkUnitPrice = milkUnitPrice;
        uint _concUnitPrice =  concUnitPrice;
        uint _cupPrice = cupPrice;

        // refill coffee cup
        uint _totalBill = (_percMilk * _milkUnitPrice) + (_percConc * _concUnitPrice);
        if(!isRefill) {
            // buy a fresh coffee cup
            _totalBill += _cupPrice; 
        }

        return _totalBill;
    }    
}