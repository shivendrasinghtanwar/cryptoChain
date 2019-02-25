const {GENESIS_DATA,MINE_RATE} = require('../config');
const cryptoHash = require('./cryptoHash');

class Block{

	//Curly braces on arguments so that no specific order is set for the arguments
	constructor({timestamp,lastHash,hash,data,difficulty,nonce}){
		this.timestamp = timestamp;
		this.lastHash = lastHash;
		this.hash = hash;
		this.data = data;
		this.difficulty = difficulty;
		this.nonce = nonce;
	}

	static mineBlock({lastBlock,data}){
		let hash,timestamp;
		// let timestamp = Date.now();
		let {difficulty} = lastBlock.difficulty;
		let nonce = 0;
		
		// let hash = cryptoHash(lastBlock.hash,timestamp,data,nonce,difficulty);

		do{
			nonce++;
			timestamp = Date.now();
			difficulty = Block.adjustDifficulty({originalBlock:lastBlock,timestamp:timestamp})
			hash = cryptoHash(lastBlock.hash,timestamp,data,nonce,difficulty);

		}while(hash.substring(0,difficulty) !=='0'.repeat(difficulty));


		return new this({
			lastHash:lastBlock.hash,
			data: data,
			hash: hash,
			timestamp: timestamp,
			difficulty: difficulty,
			nonce: nonce
			});
	}

	static genesis(){
		return new this(GENESIS_DATA);
	}

	static adjustDifficulty({originalBlock, timestamp}){
		const {difficulty} = originalBlock;

		if(difficulty < 1) {
			return 1;
		}

		if((timestamp - originalBlock.timestamp) > MINE_RATE){
			return difficulty-1;
		}
	
		return difficulty+1;
	}
}

/*const blk1 = new Block({
	timestamp:'01/01/01',
	lastHash:'lorem',
	hash:'ipsum',
	data:'data'
	);

console.log(blk1); */

module.exports = Block;