const Nervos = require('@nervos/chain').default

const config = require('./config')

const nervos = Nervos(config.chain) // config.chain indicates that the address of Appchain to interact

nervos.contractAddress = config.contractAddress
nervos.adminAddress = config.adminAddress

nervos.a2eApi = config.api + config.a2eApi
nervos.e2aApi = config.api + config.e2aApi


module.exports = nervos
