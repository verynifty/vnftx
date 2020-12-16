// scripts/deploy.js
const { ethers, upgrades } = require("hardhat");
const chalk = require("chalk");
const BigNumber = require("bignumber.js");

const fs = require("fs");
async function main() {
  const MuseToken = await deploy("MuseToken");

  const VNFT = await deploy("VNFT", [MuseToken.address]);

  const NiftyAnimals = await deploy("NiftyAnimals", [
    VNFT.address,
    MuseToken.address,
  ]);

  //   grant vnft minter role to nify animals
  await VNFT.grantRole(
    "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
    NiftyAnimals.address
  );
  // grant miner role to VNFT
  await MuseToken.grantRole(
    "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
    VNFT.address
  );

  //   create gem
  const threeDays = 60 * 60 * 24 * 3;

  await VNFT.createItem("diamond", 1, 100, threeDays);

  // mint muse
  await MuseToken.mint(
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "10000000000000000000000000"
  );

  //   start animals lottery

  await NiftyAnimals.start(1);

  console.log(
    `current vnft : ${(await NiftyAnimals.currentVNFT()).toString()}`
  );

  console.log(`end Time : ${(await NiftyAnimals.endTime()).toString()}`);

  //   approve muse spent from user to contract
  await MuseToken.approve(NiftyAnimals.address, "10000000000000000000000");
  console.log("approved muse");
  //   feed pet
  await NiftyAnimals.feedPet();

  console.log(`winner so far : ${await NiftyAnimals.winner()}`);
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
