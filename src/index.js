const express = require('express');
const Blockchain = require('./blockchain/blockchain');
const bodyParser = require('body-parser');
const PubSub = require('./app/pubsub');
const request = require('request');


const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({blockchain});
const DEFAULT_PORT = 3500;

const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;
// setTimeout(() => pubsub.broadcastChain(),1000);

app.use(bodyParser.json());

app.get('/api/blocks',(req,res) =>{
    res.json(blockchain.chain);
});

app.post('/api/mine',(req,res)=>{
    const {data} = req.body;

    blockchain.addBlock({ data });

    pubsub.broadcastChain();
    res.redirect('/api/blocks');
});

const syncChain = ( ) => {
    request({ url : `${ROOT_NODE_ADDRESS}/api/blocks` },(error,response,body) => {
        if(!error && response.statusCode === 200){
            const rootChain = JSON.parse(body);

            console.log("Replace chain on sync with",rootChain);
            blockchain.replaceChain(rootChain);
        }
    });
};

let PEER_PORT;

if(process.env.GENERATE_PEER_PORT === 'true'){
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
const port = PEER_PORT || DEFAULT_PORT;
app.listen(port,()=>{
    console.log(`Listening at localhost:${port}`)

    if(port !== DEFAULT_PORT){
        syncChain();
    }
    
});