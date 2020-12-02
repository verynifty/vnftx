// scripts/prepare_upgrade.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  const proxyAddress = "0x14d4D06B8e8df9B85A37D622aA95784a4FCcB130";

  // leaving this as was the tutorial i did, in case questions arise.
  // const BoxV2 = await ethers.getContractFactory("BoxV2");
  // console.log("Preparing upgrade...");
  // const boxV2Address = await upgrades.prepareUpgrade(proxyAddress, BoxV2);
  // console.log("BoxV2 at:", boxV2Address);

  const VNFTxV4 = await ethers.getContractFactory("VNFTxV4");
  console.log("Preparing upgrade...");
  const vnftxV4Address = await upgrades.prepareUpgrade(proxyAddress, VNFTxV4, {
    unsafeAllowCustomTypes: true,
  });
  console.log("VNFTxV4 at:", vnftxV4Address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
