const Blockchain = require('../blockchain/blockchain');

const blockchain = new Blockchain();

blockchain.addBlock({data:'inital'});

let prevTimestamp,nextTimestamp, nextBlock, timeDiff, average;

const times = [];
console.log('| Block # | timeDiff | difficulty | average | Hash | Last Hash |');
for(let i=0;i<10000;i++){
    prevTimestamp = blockchain.chain[blockchain.chain.length-1].timestamp;
    blockchain.addBlock({data:`block${i}`});
    nextBlock = blockchain.chain[blockchain.chain.length-1];

    nextTimestamp = nextBlock.timestamp;
    timeDiff = nextTimestamp - prevTimestamp;
    times.push(timeDiff);

    average = times.reduce((total, num)=>(total + num))/times.length;

    console.log(`|    ${i}    |    ${timeDiff}    |   ${nextBlock.difficulty}   |    ${average}ms    |`);

}