const Transaction = require('../../src/wallet/transaction');
const Wallet = require('../../src/wallet/index');
const {verifySignature} = require('../../src/util/index');
const {REWARD_INPUT,MINING_REWARD} = require('../../config');

describe('Transactions',()=>{
    let transaction,senderWallet,recepient,amount;

    beforeEach(()=>{
        senderWallet = new Wallet();
        recepient = 'recipientPublicKey';
        amount = 50;

        transaction = new Transaction({senderWallet,recepient,amount});
    });

    it('has an id',()=>{
        expect(transaction).toHaveProperty('id');
    });

    describe('outputMap',()=>{
        it('has an outputMap',()=>{
            expect(transaction).toHaveProperty('outputMap');
        });

        it('outputs the amount to the recepient',()=>{
            expect(transaction.outputMap[recepient]).toEqual(amount);
        });

        it('output the remaining balance for the senderWallet',()=>{
            expect(transaction.outputMap[senderWallet.publicKey]).toEqual(senderWallet.balance - amount);
        });
    });

    describe('input section',()=>{
        it('has an input',()=>{
            expect(transaction).toHaveProperty('input');
        });

        it('has a timestamp',()=>{
            expect(transaction.input).toHaveProperty('timestamp');
        });

        it('sets the amount to the senderWallet balance',()=>{
            expect(transaction.input.amount).toEqual(senderWallet.balance);
        });

        it('sets the address to the senderWallet publicKey',()=>{
            expect(transaction.input.address).toEqual(senderWallet.publicKey);
        });

        it('sign the input',()=>{
            expect(
                verifySignature({publicKey:senderWallet.publicKey,data:transaction.outputMap,signature:transaction.input.signature})
            ).toBe(true);
            
        })
    });

    describe('validTransaction()',()=>{
        let errorMock;

        beforeEach(()=>{
            errorMock = jest.fn();
            global.console.error = errorMock;
        });
        describe('transaction is valid',()=>{
            it('returns true',()=>{
                expect(Transaction.validTransaction(transaction)).toBe(true);
            });
        });
    
        describe('when the transaction is invalid',()=>{
            describe('and a trasaction outputMap vlue is invalid',()=>{
                it('returns false',()=>{
                    transaction.outputMap[senderWallet.publicKey] = 999999999;
                    expect(Transaction.validTransaction(transaction)).toBe(false);
                    expect(errorMock).toHaveBeenCalled();
                });
            });
            describe('and the transaction input signature is invalid',()=>{
                it('returns false',()=>{
                    transaction.input.signature = new Wallet().sign('data');
                    expect(Transaction.validTransaction(transaction)).toBe(false);
                    expect(errorMock).toHaveBeenCalled();
                });
            });
        });
    });

    describe('updateTransaction()',()=>{
        let originalSignature, originalSenderOutput, nextRecepient, nextAmount;

        describe('the amount is invalid',()=>{
            it('throws an error',()=>{
                expect(()=>{
                    transaction.update({
                        senderWallet, recepient:'testRecepient',amount:999999
                    })
                }).toThrow('Amount exceeds balance');
            });
        });
        
        describe('the amount is valid ',()=>{
            beforeEach(()=>{
                originalSignature = transaction.input.signature;
                originalSenderOutput = transaction.outputMap[senderWallet.publicKey];
                nextRecepient = 'next-recepient';
                nextAmount = 99;
                
                transaction.update({senderWallet,recepient:nextRecepient,amount:nextAmount});
            });
    
            it('outputs the amount to the recepient',()=>{
                expect(transaction.outputMap[nextRecepient]).toEqual(nextAmount);
            });
            it('subtracts the amount from the original sender output amount',()=>{
                expect(transaction.outputMap[senderWallet.publicKey])
                .toEqual(originalSenderOutput - nextAmount);
            });
            it('maintains a total outpu that matches the input amount',()=>{
                expect(
                    Object.values(transaction.outputMap)
                .reduce((total, outputAmount)=>total + outputAmount))
                .toEqual(
                    transaction.input.amount
                );
            });
            it('re-asigns the transaction',()=>{
                expect(transaction.input.signature).not.toEqual(originalSignature);
            });   
            
            describe('and another update but for same recepient',()=>{
                let addedAmount;

                beforeEach(()=>{
                    addedAmount = 66;
                    transaction.update({
                        senderWallet,recepient:nextRecepient,amount:addedAmount
                    });
                });

                it('adds to the recepient amount',()=>{
                    expect(transaction.outputMap[nextRecepient])
                    .toEqual(nextAmount + addedAmount);
                });
                it('subtracts the amount from the original sender output amount',()=>{
                    expect(transaction.outputMap[senderWallet.publicKey])
                    .toEqual(originalSenderOutput - nextAmount - addedAmount);
                });
            });
        });        
    });

    describe('rewardTransaction()',()=>{
        let rewardTransaction,minerWallet;

        beforeEach(()=>{
            minerWallet = new Wallet();
            rewardTransaction = Transaction.rewardTransaction({ minerWallet });
        });

        it('creates the transaction with the reward input',()=>{
            expect(rewardTransaction.input).toEqual(REWARD_INPUT);
        });

        it('creates one transaction for the miner with the mining reward',()=>{
            expect(rewardTransaction.outputMap[minerWallet.publicKey]).toEqual(MINING_REWARD);
        });
    });
    
});