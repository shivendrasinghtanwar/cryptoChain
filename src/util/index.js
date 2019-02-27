const EC = require('elliptic').ec;
const cryptoHash = require('./cryptoHash');
//secp = Standards of Efficient Cryptography Prime 256 Koblets
const ec = new EC('secp256k1');

const verifySignature = ({publicKey,data,signature}) => {
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex');
    return keyFromPublic.verify(cryptoHash(data),signature);
};


module.exports = {ec,verifySignature};

