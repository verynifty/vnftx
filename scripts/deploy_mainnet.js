// scripts/deploy.js

const ACCESSORY = "0x47F42e4d4dE7EBF20d582e57ecd88ff64B2d7910";
MUSE_TOKEN = "0xB6Ca7399B4F9CA56FC27cBfF44F4d2e4Eef1fc81";
VNFT_CONTRACT = "0x57f0B53926dd62f2E26bc40B30140AbEA474DA94";
const proxy = "0x14d4D06B8e8df9B85A37D622aA95784a4FCcB130";
const RopstenProxy = "0x822b6eCB40467F1d3F4779814f323e19168C6E29";
const { ethers, upgrades } = require("hardhat");
const chalk = require("chalk");
const fs = require("fs");
async function main() {
  // const VNFTx = await ethers.getContractFactory("VNFTx");
  // console.log("Deploying VNFTx...");
  // const vnftx = await upgrades.deployProxy(
  //   VNFTx,
  //   [VNFT_CONTRACT, MUSE_TOKEN, ACCESSORY],
  //   {
  //     initializer: "initialize",
  //     unsafeAllowCustomTypes: true,
  //   }
  // );
  // console.log("VNFTx deployed to:", vnftx.address);
  VNFTxV4 = await ethers.getContractFactory("VNFTxV4");
  console.log("Preparing upgrade...");
  vnftxV4Address = await upgrades.prepareUpgrade(proxy, VNFTxV4, {
    unsafeAllowCustomTypes: true,
  });
  console.log("VNFTxV4 at:", vnftxV4Address);
  vnftx = await upgrades.upgradeProxy(
    proxy, //proxy aka original deployement
    VNFTxV4,
    { unsafeAllowCustomTypes: true }
  );
}

async function deploy(name, _args) {
  const args = _args || [];

  console.log(`📄 ${name}`);
  const contractArtifacts = await ethers.getContractFactory(name);
  const contract = await contractArtifacts.deploy(...args);
  console.log(
    chalk.cyan(name),
    "deployed to:",
    chalk.magenta(contract.address)
  );
  // fs.writeFileSync(`artifacts/${name}.address`, contract.address);
  console.log("\n");
  return contract;
}

main();
