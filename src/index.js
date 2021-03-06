const express = require('express');
const path = require('path');
const Blockchain = require('./blockchain/blockchain');
const bodyParser = require('body-parser');
const PubSub = require('./app/pubsub');
const request = require('request');
const TransactionPool = require('./wallet/transactionPool');
const TransactionMiner = require('./app/transactionMiner');
const Wallet = require('./wallet/index');

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool, wallet });
const DEFAULT_PORT = 3500;
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });

const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;
// setTimeout(() => pubsub.broadcastChain(),1000);

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'client/dist')));

//API-EndPOINTS
app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    const { data } = req.body;

    blockchain.addBlock({ data });

    pubsub.broadcastChain();
    res.redirect('/api/blocks');
});

app.post('/api/transact', (req, res) => {
    const { amount, recepient } = req.body;
    // console.log(JSON.stringify(transactionPool));
    let transaction = transactionPool.existingTransaction({ inputAddress: wallet.publicKey });
    try {
        if (transaction) {
            transaction.update({ senderWallet: wallet, recepient, amount })
        } else {
            transaction = wallet.createTransaction({ recepient, amount, chain: blockchain.chain });
        }
    } catch (error) {
        return res.status(400).json({ type: 'error', message: error.message });
    }
    transactionPool.setTransaction(transaction);

    pubsub.broadcastTransaction(transaction);

    res.json({ type: 'success', transaction });
});

app.get('/api/transactionPoolMap', (req, res) => {
    // const {} = ;
    res.json(transactionPool);
});

app.get('/api/mineTransactions', (req, res) => {
    transactionMiner.mineTransactions();
    res.redirect('/api/blocks');
});

app.get('/api/wallet/info', (req, res) => {
    res.json({
        address: wallet.publicKey,
        balance: Wallet.calculateBalance({ chain: blockchain, address: wallet.publicKey })
    });
});

//Frontend Routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});




//Functions
const syncWithRootState = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);

            console.log("Replace chain on sync with", rootChain);
            blockchain.replaceChain(rootChain);
        }
    });

    request({ url: `${ROOT_NODE_ADDRESS}/api/transactionPoolMap` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootTransactionPoolMap = JSON.parse(body);

            console.log("Replace transaction pool map on sync with", rootTransactionPoolMap);
            transactionPool.setMap(rootTransactionPoolMap);
        }
    });
};

const walletFoo = new Wallet();
const walletBar = new Wallet();

const generateWalletTransaction = ({wallet, recepient, amount})=>{
    const transaction = wallet.createTransaction({
        recepient:recepient,amount: amount,chain: blockchain.chain
    });

    transactionPool.setTransaction(transaction);
};

const walletAction = () => generateWalletTransaction({
    wallet,recepient:walletFoo.publicKey,amount:5
});

const walletFooAction = () => generateWalletTransaction(
    {wallet:walletFoo,recepient: walletBar.publicKey,amount:10}
);

const walletBarAction = () => generateWalletTransaction(
    {wallet:walletBar,recepient: wallet.publicKey,amount:10}
);

for(let i=0;i<10;i++){
    if(i%3===0){
        walletAction();
        walletFooAction();
    }else if(i%3==0){
        walletAction();
        walletFooAction();
    }else{
        walletFooAction();
        walletBarAction();
    }

    transactionMiner.mineTransactions();
}



let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
const port = PEER_PORT || DEFAULT_PORT;
app.listen(port, () => {
    console.log(`Listening at localhost:${port}`)

    if (port !== DEFAULT_PORT) {
        syncWithRootState();
    }

});