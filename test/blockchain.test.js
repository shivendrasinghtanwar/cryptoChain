const Blockchain = require('../src/blockchain');
const Block = require('../src/block');


describe('Blockchain()',()=>{
    var blockchain;

    beforeEach(()=>{
        blockchain = new Blockchain();
    });

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


    describe('isValidChain()',()=>{
        describe('When the chain does not start with the genesis block',()=>{
            it('return false',()=>{
                blockchain.chain[0] = { data : 'fakeGenesis'};

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe('when the chain starts with the ggensis block and has multiple blocks',()=>{

            beforeEach(()=>{
                blockchain.addBlock({data:'beats'});
                blockchain.addBlock({data:'bears'});
                blockchain.addBlock({data:'kites'});

            });
            describe('lastHash reference has changed',()=>{
                it('Retruns false',()=>{
                    
                    blockchain.chain[2].lastHash = 'brokenLastHash';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);

                });
            });

            describe('And the chain contain a block with an invalid field',()=>{
                it('returns false',()=>{

                    blockchain.chain[2].data = 'someBadData';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            
            });

            describe('and the chain does not contains any invalid blocks',()=>{
                it('Reurns true',()=>{

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });
});

