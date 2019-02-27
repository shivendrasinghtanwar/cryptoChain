const cryptoHash = require('../src/util/cryptoHash');

describe('cryptoHash()',()=>{
    const testInput = "sunny";
    const testOutput = '1f64de2d5ca7f8c83e49a7a581791d47d039fa582f3168e6a7d639b82cd4ff28';
    
    it('cryptoHash creates correct hashed output',()=>{
        expect(cryptoHash(testInput))
        .toEqual(testOutput);
    });

    it('Produces the same hash with same input arguments in any order', ()=>{
        expect(cryptoHash('one','two','three')).toEqual(cryptoHash('three','two','one'));
    });

    it('produces a unique hash when the properties have changed on an input',()=>{
        const foo = {};
        const originalHash = cryptoHash(foo);
        foo['a'] = 'as';

        expect(cryptoHash(foo)).not.toEqual(originalHash);
    });
});