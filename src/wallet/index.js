const {STARTING_BALANCE} = require('../../config');
const cryptoHash = require('../util/cryptoHash');
const {ec} = require('../util/index');
const Transaction = require('./transaction');

class Wallet{
    constructor(){
        this.balance = STARTING_BALANCE;

        this.keyPair = ec.genKeyPair();

        this.publicKey = this.keyPair.getPublic().encode('hex');       
    }

    sign(data){

        return this.keyPair.sign(cryptoHash(data));
    }

    createTransaction({recepient,amount}){
        if(amount > this.balance){
            throw new Error('Amount exceeds balance');
        }
        const transaction = new Transaction(
            {senderWallet:this,
                recepient:recepient,
                amount:amount
            });

        return transaction;
    }
}
module.exports = Wallet;