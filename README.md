`npm install`

`npm run compile`

`npm run deploy`

`npm run console`

## To Deploy

1. Run npm run chain
1. Deploy Muse, VNFT and Addons from the other project
1. Paste the addresses in `./script/deploy.js`
1. run `npm run deploy`
1. Get the contract address and paste it in `proxyAddress` on `./scripts/prepare-upgrade.js` and `./scripts/upgrade.js`
1. run `npx hardhat run ./scripts/prepare-upgrade.js && npx hardhat run ./scripts/upgrade.js`

## To play with it after deploy

1. run `npm run console`
1. `const VNFTxV2 = await ethers.getContractFactory("VNFTxV2");`
1. `const vnftxv2 = await VNFTxV2.attach(proxyAddress)`
1. now `vnftxv2` should have old storage with new functions.
