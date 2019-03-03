const Transaction = require('./transaction');


class TransactionPool{
    constructor(){
        this.transactionMap = {};
    }

    clear(){
        this.transactionMap = {};
    }

    clearBlockchainTransactions({chain}){
        for(let c=1;c<chain.length;c++){
            const block = chain[c];

            for(let transaction of block.data){
                if(this.transactionMap[transaction.id]){
                    delete this.transactionMap[transaction.id];
                } 
            }
        }
    }

    setTransaction(transaction){
        this.transactionMap[transaction.id] = transaction;
    }

    setMap({transactionMap}){
        // console.log("set mapp===========================================================================");
        // console.log(transactionMap);
        this.transactionMap = transactionMap; 
    }

    existingTransaction({ inputAddress }){
        const transactions = Object.values(this.transactionMap);
        // console.log("ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss")

            // console.log(this.transactionMap.input);
        return transactions.find(transaction => transaction.input.address === inputAddress);
    }

    validTransactions(){
       return Object.values(this.transactionMap).filter(
            transaction => Transaction.validTransaction(transaction)
        ); 
    }
}

module.exports = TransactionPool;