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

  const VNFT = await deploy("VNFT", [MuseToken.address]);

  const VNFTx = await ethers.getContractFactory("VNFTxV4");
  console.log("Deploying VNFTx...");
  const vnftx = await upgrades.deployProxy(
    VNFTx,
    [VNFT.address, MuseToken.address, NiftyAddons.address],
    {
      initializer: "initialize",
      unsafeAllowCustomTypes: true,
    }
  );
  console.log("VNFTx deployed to:", vnftx.address);

  // Copied scripts from old contracts folder

  // grant miner role to VNFT
  await MuseToken.grantRole(
    "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
    VNFT.address
  );
  console.log("🚀 Granted MuseToken Minter Role to VNFT \n");

  // grant miner role to VNFT
  await MuseToken.grantRole(
    "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
    vnftx.address
  );
  console.log("🚀 Granted MuseToken Minter Role to VNFTx \n");

  // mint to other user to test erc1155 works

  await MuseToken.mint(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    "1000000000000000000000"
  );

  console.log("🚀 Granted MuseToken Minter Role to MasterChef \n");

  // reate an item with 5 points
  const threeDays = 60 * 60 * 24 * 3;
  await VNFT.createItem("diamond", 5, 100, threeDays);
  await VNFT.createItem("cheat", 1, 10000, 60 * 60 * 24);
  await VNFT.createItem("cheat", 1, 10000, threeDays);
  console.log("🚀 added item diamond \n");

  await VNFT.mint("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
  await VNFT.mint("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
  console.log("🚀 Minted one vNFT to for test \n");

  await MuseToken.approve(VNFT.address, "100000000000000000000000000000000000");

  // start 9 days of mining and claiming
  await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 + 2]); // add 1day
  await VNFT.claimMiningRewards(0);
  await VNFT.claimMiningRewards(1);

  await VNFT.buyAccesory(0, 1);
  await VNFT.buyAccesory(1, 1);
  await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 + 2]); // add 1day
  await VNFT.claimMiningRewards(0);
  await VNFT.claimMiningRewards(1);

  await VNFT.buyAccesory(0, 1);
  await VNFT.buyAccesory(1, 1);

  await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 + 2]); // add 1day
  await VNFT.claimMiningRewards(0);
  await VNFT.claimMiningRewards(1);
  await VNFT.buyAccesory(1, 1);
  await VNFT.buyAccesory(0, 1);

  await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 + 2]); // add 1day
  await VNFT.claimMiningRewards(0);
  await VNFT.claimMiningRewards(1);

  await VNFT.buyAccesory(0, 1);
  await VNFT.buyAccesory(1, 1);

  await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 + 2]); // add 1day
  await VNFT.claimMiningRewards(0);
  await VNFT.claimMiningRewards(1);

  await VNFT.buyAccesory(0, 1);
  await VNFT.buyAccesory(1, 1);

  await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 + 2]); // add 1day
  await VNFT.claimMiningRewards(0);
  await VNFT.claimMiningRewards(1);

  await VNFT.buyAccesory(0, 1);
  await VNFT.buyAccesory(1, 1);

  await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 + 2]); // add 1day
  await VNFT.claimMiningRewards(0);
  await VNFT.claimMiningRewards(1);

  await VNFT.buyAccesory(0, 1);
  await VNFT.buyAccesory(1, 1);

  await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 + 2]); // add 1day
  await VNFT.claimMiningRewards(0);
  await VNFT.claimMiningRewards(1);

  // await VNFT.buyAccesory(0, 1);

  await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 + 2]); // add 1day
  await VNFT.claimMiningRewards(0);
  await VNFT.claimMiningRewards(1);
  let hp = await vnftx.getHp(0);
  let rarity = await vnftx.rarity(0);

  await MuseToken.approve(vnftx.address, "1000000000000000000000");

  console.log("🚀 Deployed NiftyAddons \n");

  await NiftyAddons.grantRole(
    "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
    vnftx.address
  );

  console.log("your hp after 9 days is: ", hp.toString());
  console.log("your rarity after 9 days is: ", rarity.toString());

  createAddonShield = await vnftx.createAddon(
    "shield",
    10,
    0,
    100,
    "RektMeRev",
    vnftx.address,
    100,
    true //this addon is locked
  );

  createAddonHat = await vnftx.createAddon(
    "hat",
    10,
    10,
    100,
    "RektMeRev",
    vnftx.address,
    100,
    false
  );

  createAddonHat = await vnftx.createAddon(
    "hat",
    10,
    20,
    100,
    "RektMeRev",
    vnftx.address,
    100,
    false
  );
  createAddonHat = await vnftx.createAddon(
    "hat",
    40,
    50,
    100,
    "RektMeRev33",
    vnftx.address,
    400,
    false
  );
  createAddonHat = await vnftx.createAddon(
    "hat",
    10,
    12,
    100,
    "RektMeRev",
    vnftx.address,
    10,
    false
  );
  createAddonHat = await vnftx.createAddon(
    "hat",
    10,
    50,
    100,
    "RektMeRev",
    vnftx.address,
    100,
    false
  );
  console.log("🚀 Created addon shield and hat \n");

  await vnftx.buyAddon(0, 1);
  await vnftx.buyAddon(0, 2);
  await vnftx.buyAddon(0, 3);
  await vnftx.buyAddon(0, 4);
  await vnftx.buyAddon(0, 5);

  await vnftx.buyAddon(1, 1);
  await vnftx.buyAddon(1, 2);
  await vnftx.buyAddon(1, 3);
  await vnftx.buyAddon(1, 4);
  await vnftx.buyAddon(1, 5);

  // rarity = await vnftx.rarity(0);
  // console.log("rarity of #0: ", rarity.toString());
  // console.log("rarity of #1: ", rarity.toString());

  hp = await vnftx.getHp(0);
  console.log("hp of #0: ", hp.toString());

  hp = await vnftx.getHp(1);
  console.log("hp of #1: ", hp.toString());

  // test battle

  let muse = await MuseToken.balanceOf(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
  );

  let museBalance = new BigNumber(parseInt(muse))
    .shiftedBy(-parseInt(18))
    .toFixed(4, 1);

  console.log("muse balance before battle ", museBalance);
  await vnftx.battle(0, 1);

  muse = await MuseToken.balanceOf(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
  );

  museBalance = new BigNumber(parseInt(muse))
    .shiftedBy(-parseInt(18))
    .toFixed(4, 1);

  console.log("muse balance after battle ", museBalance);

  hp = await vnftx.getHp(0);
  console.log("hp after battle of  #0: ", hp.toString());

  hp = await vnftx.getHp(1);
  console.log("hp after battle of #1: ", hp.toString());

  // test cahsback

  await vnftx.cashback(0);
  muse = await MuseToken.balanceOf(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
  );
  museBalance = new BigNumber(parseInt(muse))
    .shiftedBy(-parseInt(18))
    .toFixed(4, 1);

  console.log("muse balance after cashback ", museBalance);
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
