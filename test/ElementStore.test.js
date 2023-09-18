const ElementStore = artifacts.require("ElementStore");

contract('ElementStore', (accounts) => {
    let elementStore;

    before(async() => {
        elementStore = await ElementStore.deployed();
    });

    it('initial element sequence must be 0', async() => {
        const sequence = await elementStore.getSequence();
        assert.equal(sequence, 0, 'Sequence must start with 0');
    });

    it('retrieve element with invalid id', async() => {
        try {
            await elementStore.getElement(0);
        } catch(error) {
            assert.include(error.message, 'Invalid Id', 'Invalid Id provided');
        }
    });

    it('add an element to the store', async() => {
        // Add element to the store
        await elementStore.addElement(web3.utils.utf8ToHex('Rice'), 0);

        // Check if the element was added successfully
        const element = await elementStore.getElement(1);
        const foundId = element.id;
        assert.equal(foundId, 1, 'First element added must have id 1');
    });

    it('duplicate element cannot be added', async() => {
        try {
            await elementStore.addElement(web3.utils.utf8ToHex('Rice'), 0); 
        } catch(error) {
            assert.include(error.message, 'Unique element name required', 'Duplicate element name not allowed');
        }
    });

    it('check if the added element is present', async() => {
        const element = await elementStore.getElement(1);
        const elementName = web3.utils.hexToAscii(element.name);
        assert.include(elementName, 'Rice', 'Added element must be found');
    });

    it('existing element name cannot be used for update', async() => {
        try {
            await elementStore.updateElement(1, web3.utils.utf8ToHex('Rice'),  0);
        } catch(error) {
            assert.include(error.message, 'Unique element name required', 'Updated element name must be unique');
        }
    });

    it('update the element by id', async() => {
        // Update the element
        const newName = 'Basmati Rice';
        const newType = 1;
        await elementStore.updateElement(1, web3.utils.utf8ToHex(newName),  newType);

        // check if the element got updated
        const element = await elementStore.getElement(1);
        const elementName = web3.utils.hexToAscii(element.name);
        const type = element.Type;
        assert.include(elementName, newName, 'Element must be updated');
        assert.equal(type, 1, 'Updated type must be 1');
    });

    
    it('remove the element by id', async() => {
        // Change the availability of element to false
        await elementStore.removeElement(1);

        // Check if the element is removed
        const element = await elementStore.getElement(1);
        const available = element.available;
        assert.equal(available, false, 'Element must be removed');
    });
});