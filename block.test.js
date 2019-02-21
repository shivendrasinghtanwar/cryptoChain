const Block = require('./block');
const {GENESIS_DATA} = require('./config');

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
    });
});
