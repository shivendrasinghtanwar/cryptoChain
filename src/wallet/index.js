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

    createTransaction({chain,recepient,amount}){
        if(chain){
            this.balance = Wallet.calculateBalance({
                chain: chain,
                address: this.publicKey
            });
        }
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

    static calculateBalance({chain,address}){
        let outputsTotal = 0;

        for(let i=1;i<chain.length;i++){
            const block = chain[i];

            for(let transaction of block.data){
                const addressOutput = transaction.outputMap[address];
                if(addressOutput){
                    outputsTotal = outputsTotal + addressOutput;
                }
                // console.log(outputsTotal,addressOutput);
            }
        }

        return STARTING_BALANCE + outputsTotal;
    }
}
module.exports = Wallet;