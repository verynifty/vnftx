// scripts/upgrade-box.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  // const BoxV2 = await ethers.getContractFactory("BoxV2");
  // const box = await upgrades.upgradeProxy(
  //   "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  //   BoxV2
  // );
  // console.log("Box upgraded");

  // const retrieve = await box.retrieve();
  // console.log("Retrieve after upgrade", retrieve.toString());

  const VNFTxV2 = await ethers.getContractFactory("VNFTxV2");
  const vnftx = await upgrades.upgradeProxy(
    "0xb7278a61aa25c888815afc32ad3cc52ff24fe575", //proxy aka original deployement
    VNFTxV2,
    { unsafeAllowCustomTypes: true }
  );
  console.log("VNFTx upgraded");
}

main();
