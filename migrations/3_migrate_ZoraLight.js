const ZoraLight = artifacts.require("ZoraLight");


module.exports = function (deployer) {
  deployer.deploy(ZoraLight, '0x16B2dafE491531b5DB409630203b5368aBb63987');
};
