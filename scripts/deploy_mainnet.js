// scripts/deploy.js

const ACCESSORY = "0x47F42e4d4dE7EBF20d582e57ecd88ff64B2d7910"
MUSE_TOKEN = "0xB6Ca7399B4F9CA56FC27cBfF44F4d2e4Eef1fc81";
VNFT_CONTRACT = "0x57f0B53926dd62f2E26bc40B30140AbEA474DA94";
const proxy = "0x23069ab3b6d8513777a97c2e91d470b88b716fd7"

const { ethers, upgrades } = require("hardhat");
const chalk = require("chalk");
const fs = require("fs");
async function main() {

    VNFTxV2 = await ethers.getContractFactory("VNFTxV2");
    console.log("Preparing upgrade...");
    vnftxV2Address = await upgrades.prepareUpgrade(proxy, VNFTxV2, {
        unsafeAllowCustomTypes: true,
    });
    console.log("VNFTxV2 at:", vnftxV2Address);
    vnftx = await upgrades.upgradeProxy(
        proxy, //proxy aka original deployement
        VNFTxV2,
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
