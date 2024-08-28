const sdk = require('@stellar/stellar-sdk');
const { Server } = require('@stellar/stellar-sdk/rpc');

// Set up the Stellar SDK to use the testnet
const server = new Server('https://soroban-testnet.stellar.org');
const network = sdk.Networks.TESTNET;
const fee = sdk.BASE_FEE;


// Step 1: Generate a Wallet
const generateWallet = () => {
    try {
      const pair = sdk.Keypair.random();
      console.log("Public Key: " + pair.publicKey());
      console.log("Secret Key: " + pair.secret());
      console.log("keyPair generated");
      return pair;
    } catch (error) {
      console.error("Error generating wallet: ", error);
    }
  };
  
  // Step 2: Fund the Wallet with Friendbot (Testnet Only)
  const fundWallet = async (publicKey) => {
    try {
      const response = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
      if (response.ok) {
        const result = await response.json();
        console.log("Wallet funded: ", result.hash);
      } else {
        console.error("Friendbot funding failed: ", response.statusText);
      }
    } catch (error) {
      console.error("Error funding wallet: ", error);
    }
  };

(async function main() {
    // Wallet and signers
    const issuerKeypair = generateWallet();
    const userKeypair = generateWallet();

    // Fund the wallet
    await fundWallet(issuerKeypair.publicKey());
    await fundWallet(userKeypair.publicKey());

    // create token assets
    const asset1 = new sdk.Asset('USDC', issuerKeypair.publicKey());
    const asset2 = new sdk.Asset('XXLM', issuerKeypair.publicKey());

    // create Liquidity Pool Pair
    const lpAsset = new sdk.LiquidityPoolAsset(asset1, asset2, 30);
    const liquidityPoolID = sdk.getLiquidityPoolId("constant_product", lpAsset);
    console.log({
        LPAsset: lpAsset,
        liquidityPoolID_: liquidityPoolID
    });

    // get account
    const account = await server.getAccount(issuerKeypair.publicKey());
    
    // deposit to liquidity pool
    const depositToPool = new sdk.TransactionBuilder(
        account, {
            fee: fee,
            networkPassphrase: network
        }
    ).addOperation(sdk.Operation.changeTrust({
            asset: lpAsset,
            limit: '1000'
        }))
    .addOperation(sdk.Operation.liquidityPoolDeposit({
            liquidityPoolId: liquidityPoolID,
            maxAmountA: '5000',
            maxAmountB: '5000',
            minPrice: {
                n: 1, // one to one equity
                d: 1
            },
            maxPrice: {
                n: 1,
                d: 1
            }
        }))
    .setTimeout(30)
    .build();

    depositToPool.sign(issuerKeypair);

    try {
        const res = await server.sendTransaction(depositToPool);
        console.log(`Deposit to Pool Completed\n Hash: ${res.hash}`);
        console.log(`View transaction at: https://stellar.expert/explorer/testnet/tx/${res.hash}`);
    } catch (error) {
        console.log(`error sending transaction`);
    }

    const userAccount = await server.getAccount(userKeypair.publicKey());

    // Swap Tokens
    const pathPaymentStrictReceiver = new sdk.TransactionBuilder(
        userAccount, {
            fee: fee,
            networkPassphrase: network
        }
    )
    .addOperation(sdk.Operation.changeTrust({
        asset: asset1,
        source: userKeypair.publicKey()
    }))
    .addOperation(sdk.Operation.pathPaymentStrictReceive({
        sendAsset: asset2,
        sendMax: '1000',
        destination: userKeypair.publicKey(),
        destAsset: asset2,
        destAmount: '200',
        source: userKeypair.publicKey()
    }))
    .setTimeout(30)
    .build();

    pathPaymentStrictReceiver.sign(userKeypair);

    try {
        const res = await server.sendTransaction(pathPaymentStrictReceiver);
        console.log(`Token Swap Completed\n Hash: ${res.hash}`);
        console.log(`View transaction at: https://stellar.expert/explorer/testnet/tx/${res.hash}`);
    } catch (error) {
        console.log(`error swapping assets: ${error}`);
    }


    // Withraw from Liquidity pool
    const lpWithdraw = new sdk.TransactionBuilder(
        account, {
            fee: fee,
            networkPassphrase: network
        }
    )
    .addOperation(sdk.Operation.liquidityPoolWithdraw({
        liquidityPoolId: liquidityPoolID,
        amount: '150',
        minAmountA: '0',
        minAmountB: '0'
    }))
    .setTimeout(30)
    .build();

    lpWithdraw.sign(issuerKeypair);
    try {
        const res = await server.sendTransaction(lpWithdraw);
        console.log(`LP-withdrawal Completed\n Hash: ${res.hash}`);
        console.log(`View transaction at: https://stellar.expert/explorer/testnet/tx/${res.hash}`);
    } catch (error) {
        console.log(`error withdrawing assets: ${error}`);
    }
})();