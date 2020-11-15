// scripts/prepare_upgrade.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  const proxyAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  const BoxV2 = await ethers.getContractFactory("BoxV2");
  console.log("Preparing upgrade...");
  const boxV2Address = await upgrades.prepareUpgrade(proxyAddress, BoxV2);
  console.log("BoxV2 at:", boxV2Address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
