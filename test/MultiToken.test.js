const MultiToken = artifacts.require("MultiToken");

contract('MultiToken', async(accounts) => {
    let multiToken;
    const metadataUri = process.env.MULTITOKEN_METADATA_URI;
    const owner = accounts[0];

    before(async() => {
        multiToken = await MultiToken.deployed();
    });

    it("should initialize the contract", async () => {
        // Check the owner
        const contractOwner = await multiToken.owner();
        assert.equal(contractOwner, owner, 'Owner is not set correctly');
    
        // Check URI
        const uri = await multiToken.uri(1);
        assert.equal(uri, metadataUri, 'URI is not empty');
    
        // Check tokenCount
        const tokenCount = await multiToken.tokenCount();
        assert.equal(tokenCount, 0, 'Initial tokenCount is not zero');
    });

    it("only the owner can set the URI", async () => {
        const newURI = "https://example.com/token/{id}.json";
        try {
            await multiToken.setURI(newURI, { from: accounts[1] });
        } catch(error) {
            assert.include(error.message, 'Ownable: caller is not the owner', 'Only owner can setURI');
        }
    });

    it("should allow the owner to set the URI", async () => {
        const newURI = "https://example.com/token/{id}.json";
    
        // Set URI
        await multiToken.setURI(newURI, { from: owner });
    
        // Check if the URI has been updated
        const updatedURI = await multiToken.uri(1);
        assert.equal(updatedURI, newURI, "URI is not set correctly");
    });

    it("only the owner can mint tokens", async () => {
        const tokenId = 1;
        const amount = 100;
        // data - digital gold coin
        const data = '0x6469676974616c20676f6c6420636f696e000000000000000000000000000000';
        try {
            await multiToken.mint(tokenId, amount, data, { from: accounts[1] });
        } catch(error) {
            assert.include(error.message, 'Ownable: caller is not the owner', 'Only owner can mint');
        }
    });
    
    it("should allow the owner to mint tokens", async () => {
        const tokenId = 1;
        const amount = 100;
        // data - digital gold coin
        const data = '0x6469676974616c20676f6c6420636f696e000000000000000000000000000000';
    
        // Mint tokens
        await multiToken.mint(tokenId, amount, data, { from: owner });
            
        // Check tokenCount
        const tokenCount = await multiToken.tokenCount();
        assert.equal(tokenCount, 1, "Token count is not updated correctly");

        // Retrieve the emitted events
        const events = await multiToken.getPastEvents("MintedToken", {
            fromBlock: 0,
            toBlock: "latest",
        });

        const latestEvent = events[events.length - 1];
        const result = latestEvent.returnValues;
        
        assert.equal(result._owner, owner, 'Owner mismatched');
        assert.equal(result._id, tokenId, 'Token id mismatched');
        assert.equal(result._amount, amount, 'Amount mismatched');
        assert.equal(result._data, data, 'Data mismatched');
    });
    
    it("should not allow minting the same token ID twice", async () => {
        const tokenId = 2;
        const amount1 = 100;
        const amount2 = 200;
        // data - digital silver coin   
        const data = '0x6469676974616c2073696c76657220636f696e00000000000000000000000000';
    
        // Mint tokens
        await multiToken.mint(tokenId, amount1, data, { from: owner });
    
        // Try minting the same token ID again
        try {
            await multiToken.mint(tokenId, amount2, data, { from: owner });
        } catch (error) {
            assert.include(error.message, 'Token id already present', 'Duplicate token id found');
        }
    
        // Check tokenCount (should still be 1)
        const tokenCount = await multiToken.tokenCount();
        assert.equal(tokenCount, 2, "Token count should not have changed");
    });
});