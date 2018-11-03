const Nervos = require('@nervos/chain').default

const config = require('./config')

const nervos = Nervos(config.chain) // config.chain indicates that the address of Appchain to interact

nervos.contractAddress = config.contractAddress
nervos.adminAddress = config.adminAddress
nervos.apiAddr = config.api

module.exports = nervos
