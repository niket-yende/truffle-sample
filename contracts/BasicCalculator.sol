// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract BasicCalculator {
    using SafeMath for uint;
    address private owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
       require(owner == msg.sender, "Only owner");
       _; 
    }

    function addValues(uint _valueA, uint _valueB) public onlyOwner view returns (uint){
        return SafeMath.add(_valueA, _valueB);
    }

    function subtractValues(uint _valueA, uint _valueB) public onlyOwner view returns (uint){
        return SafeMath.sub(_valueA, _valueB);
    }

    function multiplyValues(uint _valueA, uint _valueB) public onlyOwner view returns (uint){
        return SafeMath.mul(_valueA, _valueB);
    }

    function divideValues(uint _valueA, uint _valueB) public onlyOwner view returns (uint){
        return SafeMath.div(_valueA, _valueB);
    }
}