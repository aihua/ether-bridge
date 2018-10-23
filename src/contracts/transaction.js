const {bytecode} = require('./compiled')

const transaction = {
    from: '0x45EcD153D504082E7a05e68D29c108867c7b72CA',
    //privateKey: nervos.appchain.accounts.wallet[0].privateKey,
    nonce: 999999,
    quota: 1000000,
    data:bytecode,
    chainId: 1,
    version: 0,
    validUntilBlock: 999999,
    value: '0x0'
};

module.exports = transaction