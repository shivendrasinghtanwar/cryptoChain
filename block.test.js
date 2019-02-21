const Block = require('./block');


describe('Block', () => {
    const timestamp = 'a-date';
    const lastHash = 'foo-hash';
    const hash = 'some-hash';
    const data = ['data1','data2'];
    const block = new Block({ timestamp, lastHash, hash, data});


    it('has a timestamp, lastHash, hash and data!',() =>{
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
    });
});
