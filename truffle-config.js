const HDWalletProvider = require('@truffle/hdwallet-provider')
const dotenv = require("dotenv")

dotenv.config()
const infuraKey = process.env.INFURA_KEY || ''
const infuraSecret = process.env.INFURA_SECRET || ''
const liveNetworkPK = process.env.LIVE_PK || ''
const privateKey = [ liveNetworkPK ]
const privateAddress = process.env.LIVE_ADDRESS
const etherscanApiKey = process.env.ETHERS_SCAN_API_KEY || ''
const polygonApiKey = process.env.POLYGON_SCAN_API_KEY || ''
const bscApiKey = process.env.BSC_SCAN_API_KEY || ''

/* just for mintfun */
const mintfunDeployerPK = process.env.MINTFUN_DEPLOYER_PK || ''
const mfPrivateKey = [mintfunDeployerPK]
const mfPrivateAddress = process.env.MINTFUN_DEPLOYER_ADDRESS
/* just for mintfun */

module.exports = {
  networks: {
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777",
      websocket: true
    },
    goerli: {
      provider: () => new HDWalletProvider({
        privateKeys: privateKey,
        //providerOrUrl: `https://:${infuraSecret}@goerli.infura.io/v3/${infuraKey}`,
        providerOrUrl: `wss://:${infuraSecret}@goerli.infura.io/ws/v3/${infuraKey}`,
        pollingInterval: 56000
      }),
      network_id: 5,
      confirmations: 2,
      timeoutBlocks: 100,
      skipDryRun: true,
      from: privateAddress,
      networkCheckTimeout: 999999
    },
    mumbai: {
      provider: () => new HDWalletProvider({
        privateKeys: privateKey,
        providerOrUrl: `https://rpc-mumbai.maticvigil.com/v1/53a113316e0a9e20bcf02b13dd504ac33aeea3ba`,
        pollingInterval: 56000
      }),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      pollingInterval: 1000,
      skipDryRun: true,
      from: privateAddress,
      networkCheckTimeout: 999999
      //websockets: true
    },
    ethf_mainnet: {
      provider: () => new HDWalletProvider({
        privateKeys: privateKey,
        providerOrUrl: `https://rpc.etherfair.link`,
        pollingInterval: 56000
      }),
      network_id: 513100,
      confirmations: 2,
      timeoutBlocks: 100,
      skipDryRun: true,
      from: privateAddress,
      networkCheckTimeout: 99999999
    },
    eth_mainnet: {
      provider: () => new HDWalletProvider({
        privateKeys: privateKey,
        providerOrUrl: `https://mainnet.infura.io/v3/db7ad163cfed48c181c8456f2ab3fe54`,
        pollingInterval: 56000
      }),
      network_id: 1,
      confirmations: 2,
      timeoutBlocks: 100,
      skipDryRun: true,
      from: privateAddress,
      networkCheckTimeout: 999999
    },
    bsc_mainnet: {
      provider: () => new HDWalletProvider({
        privateKeys: privateKey,
        providerOrUrl: `https://bsc-dataseed1.ninicoin.io`,
        pollingInterval: 56000
      }),
      network_id: 56,
      confirmations: 2,
      timeoutBlocks: 100,
      skipDryRun: true,
      from: privateAddress,
      networkCheckTimeout: 999999
    },
    zora_mainnet: {
      provider: () => new HDWalletProvider({
        privateKeys: mfPrivateKey,
        providerOrUrl: `https://rpc.zora.energy`,
        pollingInterval: 56000
      }),
      network_id: 7777777,
      confirmations: 2,
      timeoutBlocks: 100,
      skipDryRun: true,
      from: mfPrivateAddress,
      networkCheckTimeout: 999999
    },
    base_mainnet: {
      provider: () => new HDWalletProvider({
        privateKeys: mfPrivateKey,
        providerOrUrl: `https://mainnet.base.org`,
        pollingInterval: 56000
      }),
      network_id: 8453,
      confirmations: 2,
      timeoutBlocks: 100,
      skipDryRun: true,
      from: mfPrivateAddress,
      networkCheckTimeout: 999999
    }
  },
  mocha: {
    timeout: 100_000
  },
  compilers: {
    solc: {
      version: "0.8.17",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
        evmVersion: "london"
      }
    }
  },
  db: {
    enabled: false
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: etherscanApiKey,
    bscscan: bscApiKey,
    polygonscan: polygonApiKey
  }
};
