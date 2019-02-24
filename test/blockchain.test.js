const Blockchain = require('../src/blockchain');
const Block = require('../src/block');


describe('Blockchain()',()=>{
    const blockchain = new Blockchain();

    it('Contains a chain array',()=>{
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('Starts with the genesis block',()=>{
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('Adds a new block to the chain',()=>{
        const newData = 'Some new Data';

        blockchain.addBlock({data : newData});

        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
    });
});