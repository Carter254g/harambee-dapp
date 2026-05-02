# HarambeeCoin (HBC)

A full-stack Web3 project — an ERC-20 token built with Solidity and a React dApp frontend with MetaMask integration.

## What is HarambeeCoin?

HarambeeCoin (HBC) is a custom ERC-20 token deployed on the Ethereum testnet. The dApp lets users connect their MetaMask wallet, check their HBC balance, send tokens to any address, and view transaction history.

## Features

- ERC-20 token with transfer, approve, mint and burn
- React frontend with MetaMask wallet connect
- Live token balance display
- Send HBC tokens to any address
- Transaction history
- Deployed on Sepolia testnet

## Tech Stack

- Smart Contract: Solidity
- Development: Hardhat
- Frontend: React, Ethers.js
- Wallet: MetaMask
- Testnet: Sepolia

## Project Structure
harambee-dapp/
├── contracts/
│   └── HarambeeCoin.sol    # ERC-20 token contract
├── ignition/modules/
│   └── HarambeeCoin.js     # Deployment script
├── test/
│   └── HarambeeCoin.js     # Contract tests
├── client/                 # React frontend
└── hardhat.config.js       # Hardhat configuration
## Getting Started

```bash
git clone https://github.com/Carter254g/harambee-dapp.git
cd harambee-dapp
npm install
npx hardhat test
```

## Roadmap

- Deploy to Sepolia testnet
- Build React dApp frontend
- MetaMask wallet integration
- Token faucet for testing
- Transaction history

## Author

Carter - Full-stack developer
GitHub: https://github.com/Carter254g

## License

MIT
