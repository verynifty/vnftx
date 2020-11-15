// test/Box.js
// Load dependencies
const { expect } = require("chai");

let Box;
let box;

// Start test block
describe("Box", function () {
  beforeEach(async function () {
    Box = await ethers.getContractFactory("Box");
    box = await Box.deploy();
    await box.deployed();
  });

  // Test case
  it("retrieve returns a value previously stored", async function () {
    // Store a value
    await box.store(42);

    // Test if the returned value is the same one
    // Note that we need to use strings to compare the 256 bit integers
    expect((await box.retrieve()).toString()).to.equal("42");
  });

  // same store on old and new
  it("works", async () => {
    const Box = await ethers.getContractFactory("Box");
    const BoxV2 = await ethers.getContractFactory("BoxV2");

    const instance = await upgrades.deployProxy(Box, [42]);
    const upgraded = await upgrades.upgradeProxy(instance.address, BoxV2);

    const value = await upgraded.value();
    expect(value.toString()).to.equal("42");
  });
});
