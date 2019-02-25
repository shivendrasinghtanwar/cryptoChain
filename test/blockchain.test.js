const Blockchain = require('../src/blockchain');
const Block = require('../src/block');
const cryptoHash = require('../src/cryptoHash');

describe('Blockchain()',()=>{
    let blockchain,newChain,originChain;

    beforeEach(()=>{
        blockchain = new Blockchain();
        newChain = new Blockchain();

        originChain = blockchain.chain;
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

        describe('when the chain starts with the gensis block and has multiple blocks',()=>{

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

            describe('and the chain has a block with jumpe ddificulty',()=>{
                it('returns false',()=>{
                    const lastBlock = blockchain.chain[blockchain.chain.length - 1 ];
                    const lastHash = lastBlock.hash;
                    const timestamp = Date.now();
                    const nonce = 0;
                    const data = [];
                    const difficulty = lastBlock.difficulty - 3;

                    const hash = cryptoHash(timestamp,lastHash,difficulty,nonce,data);

                    const badBlock = new Block({
                        timestamp,lastHash,difficulty,nonce,data
                    });

                    blockchain.chain.push(badBlock);

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });
        });
    });

    describe('replaceChain()',()=>{
        let errorMock,logMock;

        beforeEach(()=>{
            errorMock = jest.fn();
            logMock = jest.fn();

            global.console.error = errorMock;
            global.console.log = logMock;
        });

        describe('When the new chain is not longer',()=>{
            beforeEach(()=>{
                newChain.chain[0] = { new : 'chain'};
                blockchain.replaceChain(newChain.chain);
            })

            it('Does not replace the chain',()=>{
                expect(blockchain.chain).toEqual(originChain);
            });

            it('logs an error',()=>{
                expect(errorMock).toHaveBeenCalled(); 
            });
        });

        describe('When the new chain is longer',()=>{
            beforeEach(()=>{
                newChain.addBlock({data:'beats'});
                newChain.addBlock({data:'bears'});
                newChain.addBlock({data:'kites'});

            });


            describe('When the chain is invalid',()=>{
                beforeEach(()=>{
                    newChain.chain[2].hash = 'someFakeHash';
                    
                    blockchain.replaceChain(newChain.chain);
                })

                it('Does not replace the chain',()=>{
                    expect(blockchain.chain).toEqual(originChain);
                });

                it('logs an error',()=>{
                    expect(errorMock).toHaveBeenCalled(); 
                });
            });

            describe('and the chain is valid',()=>{
                beforeEach(()=>{
                    blockchain.replaceChain(newChain.chain);
                });
 
                it('Replaces the chain',()=>{

                    expect(blockchain.chain).toEqual(newChain.chain);
                });

                it('logs about chain replacement',()=>{
                    expect(logMock).toHaveBeenCalled(); 
                });
            });
        });
    });
});

