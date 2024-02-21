const DestinyHashRing = artifacts.require("BlastDestinyHashRing");

var Web3 = require("web3")
var web3 = new Web3()


module.exports = function (deployer, network) {
  let bidValue = 0
  
  if(network=='ethf_mainnet') {
    bidValue = web3.utils.toWei('1', 'ether');
  } else if(network=='bsc_mainnet') {
    bidValue = web3.utils.toWei('0.03', "ether");
  } else if(network=='zora_mainnet') {
    bidValue = web3.utils.toWei('0.003', 'ether');
  } else if(network=='blast_test') {
    bidValue = web3.utils.toWei('0.001', 'ether');
  }
  
  if(bidValue==0) {
    console.log('not set correct value')
    return;
  }

  console.log('network===', network, bidValue)
  deployer.deploy(DestinyHashRing, bidValue, '0x0000007915D5D3FF91aaFa880d1D9c352165B364');
};
