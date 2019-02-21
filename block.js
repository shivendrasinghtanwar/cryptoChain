class Block{
	constructor(timestamp,lastHash,hash,data){
		this.timestamp = timestamp;
		this.lastHash = lastHash;
		this.hash = hash;
		this.data = data;
	}
}

const blk1 = new Block('01/01/01','lorem','ipsum','data');

console.log(blk1); 