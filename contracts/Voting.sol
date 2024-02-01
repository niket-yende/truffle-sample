// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Voting {
    uint256 public itemId;
    
    mapping(uint256 => uint64) votes;
    mapping(address => bool) hasVoted;
    uint[] items;

    struct Item {
        uint ID;
        string Name;
    }
    mapping(uint256 => Item) itemMap;

    constructor() {}

    function proposeItem(string memory _item) public returns (uint256) {
        require(bytes(_item).length > 0, 'Item must be present');
        itemId++;
        itemMap[itemId] = Item(itemId, _item);
        items.push(itemId);
        return itemId;
    }

    function voteForItem(uint256 _itemId) public {
        require(_itemId > 0 && _itemId <= items.length, 'Provide valid Item id');
        require(!hasVoted[msg.sender], 'User already voted');
        hasVoted[msg.sender] = true;
        votes[_itemId]++; 
    }

    function getWinner() public view returns(Item memory) {
        uint highestVote = 0;
        Item memory winner;
        for (uint256 index = 1; index <= items.length; index++) {
            Item memory item = itemMap[index];
            uint256 itemVotes = votes[item.ID];
            if(itemVotes > highestVote) {
                highestVote = itemVotes;
                winner = item;
            }
        }
        return winner;
    }
}