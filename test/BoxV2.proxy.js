// test/BoxV2.proxy.js
// Load dependencies
const { expect } = require("chai");

let Box;
let BoxV2;
let box;
let boxV2;

// Start test block
describe("BoxV2 (proxy)", function () {
  beforeEach(async function () {
    Box = await ethers.getContractFactory("Box");
    BoxV2 = await ethers.getContractFactory("BoxV2");

    box = await upgrades.deployProxy(Box, [42], { initializer: "store" });
    boxV2 = await upgrades.upgradeProxy(box.address, BoxV2);
  });

  // Test case
  it("retrieve returns a value previously incremented", async function () {
    // Increment
    await boxV2.increment();

    // Test if the returned value is the same one
    // Note that we need to use strings to compare the 256 bit integers
    expect((await boxV2.retrieve()).toString()).to.equal("43");
  });
});
