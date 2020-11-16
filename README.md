`npm install`

`npm run compile`

`npm run deploy`

`npm run console`

## To Deploy

1. Run `npm run chain`
1. run `npm run deploy`
1. Get the contract address and paste it in `proxyAddress` on `./scripts/prepare-upgrade.js` and `./scripts/upgrade.js`
1. run `npm run prepare && npm run upgrade` to deploy the second "upgrade" contract.

## To play with it after deploy

1. run `npm run console`
1. `const VNFTxV2 = await ethers.getContractFactory("VNFTxV2");`
1. `const vnft = await VNFTxV2.attach(proxyAddress)` > This is the new contract that should hold the old contract store.
1. now `vnft` should have old storage with new functions.
