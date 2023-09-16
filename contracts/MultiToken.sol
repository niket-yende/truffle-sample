// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract MultiToken is Initializable, ERC1155Upgradeable, OwnableUpgradeable, PausableUpgradeable, ERC1155BurnableUpgradeable, UUPSUpgradeable {
    uint public tokenCount;
    mapping(uint => bool) private tokenMap;

    event MintedToken(address _owner, uint _id, uint _amount, bytes _data);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() initializer public {
        __ERC1155_init("");
        __Ownable_init();
        __Pausable_init();
        __ERC1155Burnable_init();
        __UUPSUpgradeable_init();
    }

    function setURI(string memory _newuri) public onlyOwner {
        _setURI(_newuri);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(uint256 _id, uint256 _amount, bytes memory _data)
        public
        onlyOwner
        returns (uint)
    {
        require(!tokenMap[_id], "Token id already present");
        _mint(msg.sender, _id, _amount, _data);
        tokenMap[_id] = true;
        tokenCount++;
        emit MintedToken(msg.sender, _id, _amount, _data);
        return tokenCount;
    }

    function mintBatch(address _to, uint256[] memory _ids, uint256[] memory _amounts, bytes memory _data)
        public
        onlyOwner
    {
        _mintBatch(_to, _ids, _amounts, _data);
    }

    function _beforeTokenTransfer(address _operator, address _from, address _to, uint256[] memory _ids, uint256[] memory _amounts, bytes memory _data)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(_operator, _from, _to, _ids, _amounts, _data);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}
}