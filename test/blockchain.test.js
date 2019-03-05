const Blockchain = require('../src/blockchain/blockchain');
const Block = require('../src/blockchain/block');
const cryptoHash = require('../src/util/cryptoHash');
const Wallet = require('../src/wallet/index')
const Transaction = require('../src/wallet/transaction');

describe('Blockchain()',()=>{
    let blockchain,newChain,originChain, errorMock;

    beforeEach(()=>{
        blockchain = new Blockchain();
        newChain = new Blockchain();

        originChain = blockchain.chain;

        errorMock = jest.fn();
        global.console.error = errorMock;
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
        let logMock;

        beforeEach(()=>{
            logMock = jest.fn();
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

        describe('and the validateTransactions flag is true',()=>{
            it('calls validTransactionData()',()=>{
                const validTransactionDataMock = jest.fn();

                blockchain.validTransactionData = validTransactionDataMock;

                newChain.addBlock({data:'foo'});
                blockchain.replaceChain(newChain.chain,true);

                expect(validTransactionDataMock).toHaveBeenCalled();
            });
        });
    });

    describe('validTransactionData()',()=>{
        let transaction, rewardTransaction, wallet;

        beforeEach(()=>{
            wallet = new Wallet();
            transaction = wallet.createTransaction({recepient:'fooTest',amount:65});
            rewardTransaction = Transaction.rewardTransaction({minerWallet:wallet});
        });

        describe('transaction data is valid',()=>{
            it('returns true',()=>{
                newChain.addBlock({data:[transaction,rewardTransaction]});

                expect(
                    blockchain.validTransactionData({chain:newChain.chain})
                ).toBe(true);

                expect(errorMock).not.toHaveBeenCalled();                
            });
        });

        describe('transaction data has multiple rewards',()=>{
            it('returns false and logs error',()=>{
                newChain.addBlock({data:[transaction,rewardTransaction,rewardTransaction]});

                expect(blockchain.validTransactionData({chain:newChain.chain})).toBe(false);

                expect(errorMock).toHaveBeenCalled(); 
            })
        });

        describe('transaction data has atleast one malformed outputMap',()=>{
            describe('and the transaction is not a reward transaction',()=>{
                it('returns false and logs error',()=>{
                    transaction.outputMap[wallet.publicKey] = 899999;

                    newChain.addBlock({data:[transaction,rewardTransaction]});

                    expect(blockchain.validTransactionData({chain:newChain.chain})).toBe(false);
                    expect(errorMock).toHaveBeenCalled(); 
                })
            });
            describe('and the transaction is a reward transaction',()=>{
                it('returns false and logs error',()=>{
                    rewardTransaction.outputMap[wallet.publicKey] = 999999;

                    newChain.addBlock({data:[transaction,rewardTransaction]});

                    expect(blockchain.validTransactionData({chain:newChain.chain})).toBe(false);
                    expect(errorMock).toHaveBeenCalled(); 
                })
            });
        });

        describe('transaction data has atleast one malformed input',()=>{
            it('returns false',()=>{
                wallet.balance = 9000;

                const evilOutputMap = {
                    [wallet.publicKey]: 8900,
                    fooRecepient: 100
                };

                const evilTransaction = {
                    input : {
                        timestamp : Date.now(),
                        amount: wallet.balance,
                        address: wallet.publicKey,
                        signature: wallet.sign(evilOutputMap)
                    },
                    outputMap : evilOutputMap
                }

                newChain.addBlock({data: [evilTransaction,rewardTransaction]});

                expect(blockchain.validTransactionData({chain:newChain.chain})).toBe(false);
                expect(errorMock).toHaveBeenCalled(); 
            })
        });

        describe('and a block contains mutiple identical transactions',()=>{
            it('returns false',()=>{
                newChain.addBlock({
                    data: [transaction,transaction,transaction,rewardTransaction]
                });

                expect(blockchain.validTransactionData({chain:newChain.chain})).toBe(false);
                expect(errorMock).toHaveBeenCalled(); 
            })
        });
    });
});

