class Block{

	//Curly braces on arguments so that no specific order is set for the arguments
	constructor({timestamp,lastHash,hash,data}){
		this.timestamp = timestamp;
		this.lastHash = lastHash;
		this.hash = hash;
		this.data = data;
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