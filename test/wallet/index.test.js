const Wallet = require('../../src/wallet/index');
const { verifySignature } = require('../../src/util/index');
const Transaction = require('../../src/wallet/transaction');
const Blockchain = require('../../src/blockchain/blockchain');
const {STARTING_BALANCE} = require('../../config');

describe('Wallet',()=>{
    let wallet;

    beforeEach(()=>{
        wallet = new Wallet();
    });

    it('has a balance',()=>{
        expect(wallet).toHaveProperty('balance');
    });

    it('has a publicKey',()=>{
        // console.log(wallet.publicKey);
        expect(wallet).toHaveProperty('publicKey');
    });

    describe('Singing Data',()=>{
        const data = "testSignData";

        it('verifies signature',()=>{
            expect(
                verifySignature({
                    publicKey : wallet.publicKey,
                    data,
                    signature : wallet.sign(data)
                })
            ).toBe(true); 
        });
        it('does not verifies invalid signature',()=>{
            expect(
                verifySignature({
                    publicKey : wallet.publicKey,
                    data,
                    signature : new Wallet().sign(data)
                })
            ).toBe(false); 
        });
    });

    describe('createTransaction()',()=>{
        describe('Amount excedes the balance',()=>{
            it('throws an error',()=>{
                expect(()=>wallet.createTransaction({amount:999999,recepient:'foo-rece'}))
                .toThrow('Amount exceeds balance');
            });
        });

        describe('and the amount is valid',()=>{
            let transaction, amount, recepient;

            beforeEach(()=>{
                amount = 50;
                recepient = 'someRecepient';
                transaction = wallet.createTransaction({amount,recepient});
            });

            it('creates an instance of the Transaction',()=>{
                expect(transaction instanceof Transaction).toBe(true);
            });

            it('matches the transaction input with the wallet',()=>{
                expect(transaction.input.address).toEqual(wallet.publicKey);
            });

            it('outputs the amount to the recepient',()=>{  
                expect(transaction.outputMap[recepient]).toEqual(amount);
            });
        });

        describe('and a chain is passed',()=>{
            it('calls Wallet.calculateBalance()',()=>{
                const calculateBalanceMock = jest.fn();

                const originalCalculateBalance = Wallet.calculateBalance;

                Wallet.calculateBalance = calculateBalanceMock;

                wallet.createTransaction({recepient:'foo',amount:50,chain:new Blockchain().chain});

                expect(calculateBalanceMock).toHaveBeenCalled();

                Wallet.calculateBalance = originalCalculateBalance;
            });
        });
    });

    describe('calculateBalance()',()=>{
        let blockchain;

        beforeEach(()=>{
            blockchain = new Blockchain();
        });

        describe('there are no outputs for the wallet',()=>{
            it('returns the starting balance',()=>{
                expect(Wallet.calculateBalance({
                        chain:blockchain.chain,
                        address: wallet.publicKey
                    })
                ).toEqual(STARTING_BALANCE);
            });
        });

        describe('there are outputs for the wallet',()=>{

            let trans1,trans2;

            beforeEach(()=>{
                trans1 = new Wallet().createTransaction({
                    recepient:wallet.publicKey,
                    amount:50
                });
                trans2 = new Wallet().createTransaction({
                    recepient:wallet.publicKey,
                    amount:20
                });

                blockchain.addBlock({
                    data:[trans1,trans2]
                });
            });

            it('adds the sum of all outputs to the balance',()=>{
                expect(Wallet.calculateBalance({
                        chain:blockchain.chain,
                        address: wallet.publicKey
                    })
                ).toEqual(STARTING_BALANCE + trans1.outputMap[wallet.publicKey] + trans2.outputMap[wallet.publicKey]);
            });
        });
    });
});
