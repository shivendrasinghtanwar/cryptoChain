const express = require('express');
const Blockchain = require('./blockchain');
const bodyParser = require('body-parser');

const app = express();
const blockchain = new Blockchain();

app.use(bodyParser.json());

app.get('/api/blocks',(req,res) =>{
    res.json(blockchain.chain);
});

app.post('/api/mine',(req,res)=>{
    const {data} = req.body;

    blockchain.addBlock({ data });

    res.redirect('/api/blocks');
});

const port = 3500;
app.listen(port,()=>{
    console.log(`Listening at localhost:${port}`)
});