// scripts/deploy.js


const { ethers, upgrades } = require("hardhat");
const chalk = require("chalk");
const fs = require("fs");
async function main() {

    const NiftyAddons = await deploy("NiftyAddons", [
        "https://gallery.verynifty.io/api/addon/",
    ]);
    const MuseToken = await deploy("MuseToken");

    const VNFT = await deploy("VNFT", [MuseToken.address]);

    const VNFTx = await ethers.getContractFactory("VNFTx");
    console.log("Deploying VNFTx...");
    const proxy = await upgrades.deployProxy(
        VNFTx,
        [VNFT.address, MuseToken.address, NiftyAddons.address],
        {
            initializer: "initialize",
            unsafeAllowCustomTypes: true,
        }
    );


    VNFTxV2 = await ethers.getContractFactory("VNFTxV2");
    console.log("Preparing upgrade...");
    vnftxV2Address = await upgrades.prepareUpgrade(proxy.address, VNFTxV2, {
        unsafeAllowCustomTypes: true,
    });
    console.log(proxy.address)
    console.log(vnftxV2Address)
    vnftx = await upgrades.upgradeProxy(
        proxy.address, //proxy aka original deployement
        VNFTxV2,
        { unsafeAllowCustomTypes: true }
      );

      VNFTxV3 = await ethers.getContractFactory("VNFTxV3");
    console.log("Preparing upgrade...");
    vnftxV3Address = await upgrades.prepareUpgrade(proxy.address, VNFTxV3, {
        unsafeAllowCustomTypes: true,
    });
    console.log(proxy.address)
    console.log(vnftxV3Address)
    vnftx = await upgrades.upgradeProxy(
        proxy.address, //proxy aka original deployement
        VNFTxV3,
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
