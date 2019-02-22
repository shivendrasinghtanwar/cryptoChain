const cryptoHash = require('./cryptoHash');

describe('cryptoHash()',()=>{
    const testInput = "sunny";
    const testOutput = 'c2333a7e3a607935c67c1e6f6810395decc9f66f592b812aaada7db94ba215d6';
    
    it('cryptoHash creates correct hashed output',()=>{
        expect(cryptoHash(testInput))
        .toEqual(testOutput);
    });

    it('Produces the same hash with same input arguments in any order', ()=>{
        expect(cryptoHash('one','two','three')).toEqual(cryptoHash('three','two','one'));
    });
});