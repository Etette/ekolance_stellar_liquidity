# Stellar Liquidity Pool Operations
This project demonstrates how to use the Stellar SDK to perform basic liquidity pool operations on the Stellar testnet. It includes generating wallets, funding them, creating token assets, depositing into a liquidity pool, swapping tokens, and withdrawing from the liquidity pool.

## Implementation Overview
Wallet Generation: Uses Keypair.random() to generate public and secret keys for the issuer and user.
Funding: Friendbot is used to fund the generated wallets on the Stellar testnet.
Liquidity Pool Operations: Operations include creating trustlines, depositing into the pool, performing token swaps, and withdrawing from the pool, all of which are signed and submitted as transactions to the Stellar network.

## Setup Instructions

### Prerequisites
Node.js installed
NPM installed

### Installation
Clone the Repository
git clone https://github.com/Etette/ekolance_stellar_liquidity.git
cd STELLAR

### Install Dependencies
npm install @stellar/stellar-sdk

### Running the Script
To run the script, use the following command:

npx node liquidityPool.js


## Key Operations
Generate Wallets: Two wallets (issuer and user) are generated using the Stellar SDK.

Fund Wallets: The wallets are funded using Stellar's Friendbot, which is available for the testnet.

Create Token Assets: Two token assets (USDC and XXLM) are created, which will be added to a liquidity pool.

Create Liquidity Pool: A liquidity pool is created using the two assets, with a 1:1 price ratio.

Deposit to Liquidity Pool: Funds are deposited into the liquidity pool from the issuer's account.

Token Swap: The user swaps tokens in the liquidity pool using a strict path payment operation.

Withdraw from Liquidity Pool: The issuer withdraws assets from the liquidity pool.


## Output

Deposit to Pool Completed
 Hash: 28a682f3768dc654bbc48f477972d18084f5e123fa8c9c70bc6091e001fb1e84
View transaction at: https://stellar.expert/explorer/testnet/tx/28a682f3768dc654bbc48f477972d18084f5e123fa8c9c70bc6091e001fb1e84

Token Swap Completed
 Hash: d8ebed53810e657fce1652ef738788cb8c8d95d1aa567938bb62fc6db53578ef
View transaction at: https://stellar.expert/explorer/testnet/tx/d8ebed53810e657fce1652ef738788cb8c8d95d1aa567938bb62fc6db53578ef

LP-withdrawal Completed
 Hash: 0804bc3cdfffba66238ec9dc911e312991b936fe555b133b35e7a2298f4dabac
View transaction at: https://stellar.expert/explorer/testnet/tx/0804bc3cdfffba66238ec9dc911e312991b936fe555b133b35e7a2298f4dabac