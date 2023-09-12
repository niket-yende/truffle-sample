// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ElementStore {
    address private owner;
    uint private sequence;    

    enum Type {
        RETAIL, // 0
        WHOLESALE // 1
    }

    struct Element {
        uint id;
        bytes32 name;
        Type Type;
        bool available;
    }

    mapping(uint => Element) elements;

    modifier onlyOnwer() {
        require(msg.sender == owner, "Owner required!");
        _;
    }

    modifier validId(uint _id) {
        require(_id > 0, 'Invalid Id');
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addElement(bytes32 _name, Type _type) external onlyOnwer {
        sequence += 1;
        Element memory element = Element(sequence, _name, _type, true);
        elements[sequence] = element;        
    }

    function getElement(uint _id) public validId(_id) view returns (Element memory element) {
        element = elements[_id];
    }

    function updateElement(uint _id, bytes32 _name, Type _type) external onlyOnwer validId(_id) {
        Element memory element = elements[_id];
        element.name = _name;
        element.Type = _type;
        elements[_id] = element;
    }

    function removeElement(uint _id) external onlyOnwer validId(_id) {
        Element memory element = elements[_id];
        element.available = false;
        elements[_id] = element;
    }

    function getSequence() public view returns (uint) {
        return sequence;
    }
}