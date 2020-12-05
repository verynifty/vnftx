// scripts/deploy.js
const { ethers, upgrades } = require("hardhat");
const chalk = require("chalk");
const BigNumber = require("bignumber.js");

const fs = require("fs");
async function main() {
    // this is to test based on tutorial in case
    // const Box = await ethers.getContractFactory("Box");
    // console.log("Deploying Box...");
    // const box = await upgrades.deployProxy(Box, [42], { initializer: "store" });
    // console.log("Box deployed to:", box.address);
    // await box.store(420);
    // const retrieve = await box.retrieve();
    // console.log("retrieve", retrieve.toString());

    const NiftyAddons = await deploy("NiftyAddons", [
        "https://gallery.verynifty.io/api/addon/",
    ]);
    const MuseToken = await deploy("MuseToken");

    const NFT1 = await deploy("VNFT", [MuseToken.address]);
    const NFT2 = await deploy("VNFT", [MuseToken.address]);
    const NFT3 = await deploy("VNFT", [MuseToken.address]);

    const NFTRace = await deploy("NFTRace");

    await NFT1.grantRole(
        "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
        "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
    );
    await NFT2.grantRole(
        "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
        "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
    );
    await NFT3.grantRole(
        "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
        "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
    );

    await NFT1.mint("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
    await NFT1.mint("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
    await NFT1.mint("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
    await NFT2.mint("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
    await NFT2.mint("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
    await NFT2.mint("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
    await NFT3.mint("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
    await NFT3.mint("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
    await NFT3.mint("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
    await NFT3.mint("0x1111111111111111111111111111111111111111");

    let entryPrice = "100000000000000000" // 0.1 ether
    entryPrice = "0"
    let raceTime = 60 * 60 * 6 // 6 hours
    let devAddress = "0x1111111111111111111111111111111111111111" // the address that will receive the fees

    await NFTRace.setRaceParameters(entryPrice, raceTime, devAddress, 5);
    await NFTRace.on('participantEntered', function (currentRace, betSize, participant, tokenAddress, tokenId) {
        console.log(betSize + " Joined the race " + currentRace.toString() + " with NFT: " + tokenAddress + "::" + tokenId.toString())
    })

    await NFTRace.on('raceEnded', function (currentRace, prize, winner) {
        console.log(winner + " won " + prize.toString() + " at the race " + currentRace.toString())
    })
    
    /* At this point everything is deployed and the owner has 3 NFT of each */
    await NFTRace.joinRace(NFT1.address, 0, 725);

    try {
        await NFTRace.joinRace(NFT1.address, 0, 725);
    } catch (error) {
        console.log("Can't join same race with same NFT");
    }

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
