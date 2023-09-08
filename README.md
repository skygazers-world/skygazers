# Skygazers

## Local Development

`git clone https://github.com/skygazers-world/skygazers.git`

`cd skygazers`

### Terminal 1

```
cd contracts/hardhat
npx hardhat node
```

### Terminal 2

```
cd contracts/hardhat
npx hardhat test --network localhost
```

## Terminal 3

```
cd frontend
npm i
npm run dev
```

Then browse to http://localhost:3000/

## Deploy contracts

```
cd contracts/hardhat
npx hardhat run deploy/deploy.ts --network goerli
```

```
. ./verify-goerli.sh
```

Replace `goerli` with `mainnet` for the same on mainnet


NOTE: This automatically puts a config file with the ABIs and contract addresses in the frontend folder in `chainconfig-goerli.json`

## Goerli frontend 

run frontend connected to goerli

`` 
cd frontend
npm run 
``


