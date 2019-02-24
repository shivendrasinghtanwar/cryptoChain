const {GENESIS_DATA} = require('../config');
const cryptoHash = require('./cryptoHash');

class Block{

	//Curly braces on arguments so that no specific order is set for the arguments
	constructor({timestamp,lastHash,hash,data}){
		this.timestamp = timestamp;
		this.lastHash = lastHash;
		this.hash = hash;
		this.data = data;
	}

	static mineBlock({lastBlock,data}){
		const timestamp = Date.now();
		const hash = cryptoHash(lastBlock.hash,timestamp,data);
		return new this({
			lastHash:lastBlock.hash,
			data: data,
			hash: hash,
			timestamp: timestamp});
	}

	static genesis(){
		return new this(GENESIS_DATA);
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