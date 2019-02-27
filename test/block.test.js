const hexToBinary = require('hex-to-binary');
const Block = require('../src/blockchain/block');
const cryptoHash = require('../src/util/cryptoHash');
const {GENESIS_DATA,MINE_RATE} = require('../config');

describe('Block', () => {
    const timestamp = 2000;
    const lastHash = 'foo-hash';
    const hash = 'some-hash';
    const data = ['data1','data2'];
    const nonce = 1;
    const difficulty = 1;
    const block = new Block({ timestamp, lastHash, hash, data,nonce ,difficulty});


    it('has a timestamp, lastHash, hash and data!',() =>{
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
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
            expect(minedBlock.hash).toEqual(
                cryptoHash(data,lastBlock.hash,minedBlock.timestamp,minedBlock.nonce,minedBlock.difficulty));
        });

        it('Sets as hash that mathces the difficulty criteria',()=>{
            expect(hexToBinary(minedBlock.hash).substring(0,minedBlock.difficulty))
            .toEqual('0'.repeat(minedBlock.difficulty));
        });

        it('adjusts the difficulty',()=>{
            const possibleResults = [lastBlock.difficulty-1,lastBlock.difficulty+1];
                
            expect(possibleResults.includes(minedBlock.difficulty)).toBe(true)
        });
    });

    describe('adjustDifficulty()',()=>{
        it('raises the diffifculty for quickly mined block',()=>{
            expect(Block.adjustDifficulty({ 
                originalBlock : block,
                timestamp : (block.timestamp + MINE_RATE - 100) }))
                .toEqual(block.difficulty+1);
        });
        it('lower the diffifculty for slowly mined block',()=>{
            expect(Block.adjustDifficulty({ 
                originalBlock : block,
                timestamp : (block.timestamp + MINE_RATE + 100) })).toEqual(block.difficulty-1);
        });

        it('has a lower limit of `1`',()=>{
            block.difficulty = -1;

            expect(Block.adjustDifficulty({originalBlock: block})).toEqual(1);
        });
    });
});
