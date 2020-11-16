// scripts/prepare_upgrade.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  const proxyAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

  // leaving this as was the tutorial i did, in case questions arise.
  // const BoxV2 = await ethers.getContractFactory("BoxV2");
  // console.log("Preparing upgrade...");
  // const boxV2Address = await upgrades.prepareUpgrade(proxyAddress, BoxV2);
  // console.log("BoxV2 at:", boxV2Address);

   VNFTxV3 = await ethers.getContractFactory("VNFTxV3");
  console.log("Preparing upgrade...");
   vnftxV2Address = await upgrades.prepareUpgrade(proxyAddress, VNFTxV3, {
    unsafeAllowCustomTypes: true,
  });
  console.log("VNFTxV3 at:", vnftxV2Address);

  VNFTxV3 = await ethers.getContractFactory("VNFTxV3");
   vnftx = await upgrades.upgradeProxy(
    "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707", //proxy aka original deployement
    VNFTxV3,
    { unsafeAllowCustomTypes: true }
  );
  console.log("VNFTx upgraded");

  let testVar = await vnftx.testVar();
  console.log("testvar not set",testVar.toString())
    await vnftx.setNewVar(42);
    testVar = await vnftx.testVar();
  console.log("testvar after set", testVar.toString())
  rarity = await vnftx.rarity(0);
  console.log("test old rarity: ", rarity.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
