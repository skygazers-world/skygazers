# Generate iterations of NFTs + metadata

## generate pngs and metadata

```
mkdir -p out
node generate.js
```

Output will be sent to `out`

## upload to IPFS

`ipfs add -r out --api /ip4/80.208.229.228/tcp/5001`

Resulting hash of the folder goes into the frontend -> .env.local to make the frontend work.
And also in contracts/hardhat/.env for contract deployment




