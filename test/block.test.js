const Block = require('../src/block');
const cryptoHash = require('../src/cryptoHash');
const {GENESIS_DATA} = require('../config');

describe('Block', () => {
    const timestamp = 'a-date';
    const lastHash = 'foo-hash';
    const hash = 'some-hash';
    const data = ['data1','data2'];
    const block = new Block({ timestamp, lastHash, hash, data});


    it('has a timestamp, lastHash, hash and data!',() =>{
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
    });

    describe('Genesis()', () =>{
        const genesisBlock = Block.genesis();

        // console.log('genesisBlock',genesisBlock);

        it('Returns a Block instance',()=>{
            expect(genesisBlock instanceof Block).toBe(true);
        });

        it('Returns the genesis data', ()=>{
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });

    describe('mineBlock()', ()=>{
        const lastBlock = Block.genesis();
        const data = 'Mined Data';
        const minedBlock = Block.mineBlock({ lastBlock, data});

        it('Returns a Block isntance', ()=>{
            expect(minedBlock instanceof Block).toBe(true);
        });

        it('Sets the lastHash variable to be the `hash` of the last block', ()=>{
            expect(lastBlock.hash).toEqual(minedBlock.lastHash);
        });

        it('Sets the data', ()=>{
            expect(minedBlock.data).toEqual(data);
        });

        it('Sets a timestamp', ()=>{
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });

        it('creates a proper hash based on inputs',()=>{
            expect(minedBlock.hash).toEqual(cryptoHash(data,lastBlock.hash,minedBlock.timestamp));
        });
    });
});
