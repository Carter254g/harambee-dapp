# HarambeeCoin (HBC)

A full-stack Web3 project — an ERC-20 token built with Solidity and a React dApp frontend with MetaMask integration.

## Live Demo

Run locally with Hardhat node and MetaMask.

## What is HarambeeCoin?

HarambeeCoin (HBC) is a custom ERC-20 token. The dApp lets users connect their MetaMask wallet, check their HBC balance, send tokens to any address, and view full transaction history.

## Features

- ERC-20 token with transfer, approve, mint and burn
- React frontend with MetaMask wallet connect
- Live token balance display
- Send HBC tokens to any address
- Full transaction history — sent and received
- 6 passing contract tests

## Tech Stack

- Smart Contract: Solidity 0.8.19
- Development: Hardhat
- Frontend: React, Vite, Tailwind CSS
- Blockchain library: Ethers.js v6
- Wallet: MetaMask
- Network: Local Hardhat node

## Project Structure
harambee-dapp/
├── contracts/
│   └── HarambeeCoin.sol      # ERC-20 token contract
├── ignition/modules/
│   └── HarambeeCoin.js       # Deployment script
├── test/
│   └── HarambeeCoin.js       # 6 contract tests
└── client/                   # React dApp frontend
└── src/
├── App.jsx            # Main dApp component
└── HarambeeCoin.json  # Contract ABI
## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Carter254g/harambee-dapp.git
cd harambee-dapp
npm install
```

### 2. Run tests

```bash
npx hardhat test
```

### 3. Start local blockchain

```bash
npx hardhat node
```

### 4. Deploy the contract

```bash
npx hardhat ignition deploy ignition/modules/HarambeeCoin.js --network localhost
```

### 5. Start the frontend

```bash
cd client
npm install
npm run dev
```

### 6. Connect MetaMask

Add Localhost network to MetaMask:
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Currency: ETH

Import a Hardhat test account using its private key, then connect on the dApp.

## Smart Contract

HarambeeCoin is a standard ERC-20 token with:

- transfer — send tokens to any address
- approve and transferFrom — allow third party transfers
- mint — owner can create new tokens
- burn — any holder can burn their tokens

## Roadmap

- Deploy to Sepolia testnet
- Token faucet for testing
- NFT minting extension
- DAO voting with HBC tokens

## Author

Carter - Full-stack developer
GitHub: https://github.com/Carter254g

## License

MIT
