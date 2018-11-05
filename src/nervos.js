const Nervos = require('@nervos/chain').default
const config = require('./config')

// config.chain indicates that the address of Appchain to interact
const nervos = Nervos(config.chain)

// set contract address
nervos.contractAddress = config.contractAddress

// set admin address
nervos.adminAddress = config.adminAddress

// set ether to ebc and ebc to ether transaction api
const apiAddress = {
    e2aApi: config.api + 'ebc_to_eths/',
    a2eApi: config.api + 'eth_to_ebcs/',
}

module.exports = {
    nervos,
    apiAddress,
}
