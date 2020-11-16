// scripts/deploy.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  // this is to test based on tutorial in case
  // const Box = await ethers.getContractFactory("Box");
  // console.log("Deploying Box...");
  // const box = await upgrades.deployProxy(Box, [42], { initializer: "store" });
  // console.log("Box deployed to:", box.address);
  // await box.store(420);
  // const retrieve = await box.retrieve();
  // console.log("retrieve", retrieve.toString());

  const vnft = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const muse = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const addons = "0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690";
  const VNFTx = await ethers.getContractFactory("VNFTx");
  console.log("Deploying VNFTx...");
  const vnftx = await upgrades.deployProxy(VNFTx, [vnft, muse, addons], {
    // initializer: "store",
    unsafeAllowCustomTypes: true,
  });
  console.log("VNFTx deployed to:", vnftx.address);
}

main();
