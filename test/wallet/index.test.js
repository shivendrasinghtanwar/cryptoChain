const Wallet = require('../../src/wallet/index');
const { verifySignature } = require('../../src/util/index');

describe('Wallet',()=>{
    let wallet;

    beforeEach(()=>{
        wallet = new Wallet();
    });

    it('has a balance',()=>{
        expect(wallet).toHaveProperty('balance');
    });

    it('has a publicKey',()=>{
        // console.log(wallet.publicKey);
        expect(wallet).toHaveProperty('publicKey');
    });

    describe('Singing Data',()=>{
        const data = "testSignData";

        it('verifies signature',()=>{
            expect(
                verifySignature({
                    publicKey : wallet.publicKey,
                    data,
                    signature : wallet.sign(data)
                })
            ).toBe(true); 
        });
        it('does not verifies invalid signature',()=>{
            expect(
                verifySignature({
                    publicKey : wallet.publicKey,
                    data,
                    signature : new Wallet().sign(data)
                })
            ).toBe(false); 
        });
    });
});
