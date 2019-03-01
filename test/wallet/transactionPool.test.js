const TransactionPool = require('../../src/wallet/transactionPool');
const Transaction = require('../../src/wallet/transaction');
const Wallet = require('../../src/wallet/index');

describe('TransactionPool()',()=>{
    let transactionPool, transaction,senderWallet;

    beforeEach(()=>{
        transactionPool = new TransactionPool();
        senderWallet = new Wallet();
        transaction = new Transaction({
            senderWallet,
            recepient: 'fakeRecepient',
            amount: 50
        });
    });

    describe('setTransaction()',()=>{
        it('adds a transaction',()=>{
            transactionPool.setTransaction(transaction);

            expect(transactionPool.transactionMap[transaction.id])
            .toBe(transaction);
        });
    });

    describe('existingTransaction()',()=>{
        it('returns an existing transaction given an input address',()=>{
            transactionPool.setTransaction(transaction);
            
            expect(transactionPool.existingTransaction({inputAddress: senderWallet.publicKey}))
            .toBe(transaction);
        });
    });
});