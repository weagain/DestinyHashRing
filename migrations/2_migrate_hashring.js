const DestinyHashRing = artifacts.require("DestinyHashRing");

var Web3 = require("web3")
var provider = new Web3.providers.HttpProvider("https://rpc.etherfair.org")
var web3 = new Web3(provider)

let betValue = web3.utils.toWei('0.01', "ether");

// deployed contract address: 0xEE3a47205388819C4b5E94865b34f3156F91a120
module.exports = function (deployer) {
  deployer.deploy(DestinyHashRing, betValue, '0xDC6F036a6FE27c8e70F4cf3b2f87Bd97a6b29a2f');
};
