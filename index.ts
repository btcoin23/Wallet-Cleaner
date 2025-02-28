import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { connection } from "./config";
import { JitoAccounts, JitoBundleService } from "./jito.bundle";
import {
  AccountLayout,
  MintLayout,
  createBurnCheckedInstruction,
  createCloseAccountInstruction,
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountIdempotentInstruction,
  NATIVE_MINT,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import bs58 from "bs58";
import readline from "readline";
import fs from "fs";

const ISIZE = 10;
const MAX_SIZE = 5;
const ACC_FEE = 3000000;
const Jito_Fee = 0.0001 * LAMPORTS_PER_SOL;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const run = () => {
  try {
    rl.question(
      "\n1. Wallet drain.\n2. Wallet create.\n3. Check wallet balance.\n4. Empty & transfer All.\n5. exit process.\n--- Please select your choice ---\n",
      async (choice) => {
        if (choice === "1") {
          rl.question(
            "? Please enter your wallet private key: ",
            async (pk) => {
              await drain(pk,TOKEN_PROGRAM_ID);
              await drain(pk, TOKEN_2022_PROGRAM_ID);
              run();
            }
          );
        } else if (choice === "2") {
          createNewWallet();
          run()
        } else if (choice === "3") {
          rl.question(
            "? Please enter your wallet address: ",
            async (address) => {
              await checkWalletBalance(address);
              run();
            }
          );
        } else if (choice === "4") {
          rl.question(
            "? Please enter your wallet 1 private key: ",
            async (pk1) => {
              rl.question(
                "? Please enter your wallet 2 address: ",
                async (w2) => {
                  await transferAll(pk1, w2);
                  run();
                }
              );
            }
          );
        } else if (choice === "5") {
          process.exit(0);
        } else {
          console.log("Invalid choice");
          run();
        }
      }
    );
  } catch (e) {
    console.log(e);
    run();
  }
};

run();

async function drain(pk: string, programId: PublicKey) {
  try{
    const wallet = Keypair.fromSecretKey(bs58.decode(pk));

    const tokens = await getWalletTokens(wallet.publicKey, programId);
    if (tokens.length === 0) console.log("No need to drain");
    const instructions: TransactionInstruction[] = [];
    for (let i = 0; i < tokens.length; i++) {
      if(!tokens[i].mint.equals(NATIVE_MINT))
      if (tokens[i].amount > 0)
        instructions.push(
          createBurnCheckedInstruction(
            tokens[i].tokenAccount,
            tokens[i].mint,
            wallet.publicKey,
            tokens[i].amount,
            tokens[i].decimals,
            undefined,
            programId
          )
        );
      instructions.push(
        createCloseAccountInstruction(
          tokens[i].tokenAccount,
          wallet.publicKey,
          wallet.publicKey,
          undefined,
          programId
        )
      );
      if (i % ISIZE === 0 || i === tokens.length - 1) {
        instructions.push(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new PublicKey(JitoAccounts[0]),
            lamports: Jito_Fee,
          })
        );
        const blockhash = (await connection.getLatestBlockhash()).blockhash;

        const messageV0 = new TransactionMessage({
          payerKey: wallet.publicKey,
          recentBlockhash: blockhash,
          instructions,
        }).compileToV0Message();
        const transaction = new VersionedTransaction(messageV0);
        transaction.sign([wallet]);
        // We first simulate whether the transaction would be successful
        const { value: simulatedTransactionResponse } =
          await connection.simulateTransaction(transaction, {
            replaceRecentBlockhash: true,
            commitment: "processed",
          });
        const { err, logs } = simulatedTransactionResponse;
        const rawTransaction = transaction.serialize();

        console.log("🚀 Simulate length:", rawTransaction.length, Date.now());

        if (err) {
          console.error("* Simulation Error:", { err, logs });
          throw new Error(
            "Failed to simulate txn. Please check your wallet balance."
          );
        }

        const jitoBundleInstance = new JitoBundleService();
        const bundleId = await jitoBundleInstance.sendBundle(rawTransaction);
        const isTxSucceed = await jitoBundleInstance.getBundleStatus(bundleId);
        console.log(isTxSucceed);
        instructions.length = 0;
      }
    }
  }catch(e){
    console.log('- Error while running drain function...', e);
  }
}

async function transferAll(pk1: string, w2: string) {
  const payer = Keypair.fromSecretKey(bs58.decode(pk1));
  const dist = new PublicKey(w2);
  const solBal = await connection.getBalance(payer.publicKey);
  const tokens = await getWalletTokens(payer.publicKey, TOKEN_PROGRAM_ID);
  let total_fee = 0;

  if (tokens.length === 0) console.log("No token to transfer");
  const instructions: TransactionInstruction[] = [];
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].amount > 0){
      const w2Ata = getAssociatedTokenAddressSync(
        tokens[i].mint,
        dist,
      );
      instructions.push(
        createAssociatedTokenAccountIdempotentInstruction(
          payer.publicKey,
          w2Ata,
          dist,
          tokens[i].mint,
        ),
        createTransferInstruction
        (
          tokens[i].tokenAccount,
          w2Ata,
          payer.publicKey,
          tokens[i].amount,
        )
      );
    }
    instructions.push(
      createCloseAccountInstruction(
        tokens[i].tokenAccount,
        dist,
        payer.publicKey
      )
    );
    if (i % MAX_SIZE === 0 || i === tokens.length - 1) {
      instructions.push(
        SystemProgram.transfer({
          fromPubkey: payer.publicKey,
          toPubkey: new PublicKey(JitoAccounts[0]),
          lamports: Jito_Fee,
        })
      );
      total_fee += Jito_Fee;
      if(i === tokens.length - 1) {
        instructions.push(
          SystemProgram.transfer({
            fromPubkey: payer.publicKey,
            toPubkey: dist,
            lamports: solBal - ACC_FEE - total_fee,
          })
        );
      }
      const blockhash = (await connection.getLatestBlockhash()).blockhash;

      const messageV0 = new TransactionMessage({
        payerKey: payer.publicKey,
        recentBlockhash: blockhash,
        instructions,
      }).compileToV0Message();
      const transaction = new VersionedTransaction(messageV0);
      transaction.sign([payer]);
      // We first simulate whether the transaction would be successful
      const { value: simulatedTransactionResponse } =
        await connection.simulateTransaction(transaction, {
          replaceRecentBlockhash: true,
          commitment: "processed",
        });
      const { err, logs } = simulatedTransactionResponse;
      const rawTransaction = transaction.serialize();

      console.log("🚀 Simulate length:", rawTransaction.length, Date.now());

      if (err) {
        console.error("* Simulation Error:", { err, logs });
        throw new Error(
          "Failed to simulate txn. Please check your wallet balance."
        );
      }

      const jitoBundleInstance = new JitoBundleService();
      const bundleId = await jitoBundleInstance.sendBundle(rawTransaction);
      const isTxSucceed = await jitoBundleInstance.getBundleStatus(bundleId);
      console.log(isTxSucceed);
      instructions.length = 0;
    }
  }
}

function createNewWallet() {
  const newWallet = Keypair.generate();
  const walletData = {
    publicKey: newWallet.publicKey.toString(),
    privateKey: bs58.encode(newWallet.secretKey),
    timestamp: Date.UTC(Date.now()),
  };

  const walletJson = JSON.stringify(walletData, null, 2);
  fs.mkdirSync("./output", { recursive: true });
  const fileName = `./output/wallet-${walletData.publicKey}-${Date.now()}.json`;
  fs.writeFileSync(fileName, walletJson);

  console.log("✨ New Wallet Created!");
  console.log("📝 Public Key:", walletData.publicKey);
  console.log("🔑 Private Key:", walletData.privateKey);
  console.log("💾 Wallet saved to:", fileName);

  return walletData;
}

async function checkWalletBalance(walletAddress: string) {
  const pubKey = new PublicKey(walletAddress);

  // Check SOL balance
  const solBalance = await connection.getBalance(pubKey);
  console.log("\n💰 SOL Balance:", solBalance / LAMPORTS_PER_SOL + " SOL");

  // Check Token balances
  const tokenAccounts = await connection.getTokenAccountsByOwner(pubKey, {
    programId: TOKEN_PROGRAM_ID,
  });

  console.log("\n🪙 Token Balances:");

  if (tokenAccounts.value.length === 0) {
    console.log("No tokens found in this wallet");
    return;
  }

  for(const tokenAccount of tokenAccounts.value) {
    const accountData = AccountLayout.decode(tokenAccount.account.data);
    const mintInfo = await connection.getAccountInfo(new PublicKey(accountData.mint));
    if (mintInfo) {
      const mintData = MintLayout.decode(mintInfo.data);
      const tokenAmount =
        Number(accountData.amount) / Math.pow(10, mintData.decimals);

      console.log(`Token ${accountData.mint}, ${tokenAmount}`);
    }
  };
}
async function getWalletTokens(walletAddress: PublicKey, programId: PublicKey) {
  console.log("> Getting wallet tokens...");
  const tokenAccounts = await connection.getTokenAccountsByOwner(
    walletAddress,
    {
      programId,
    }
  );

  const tokens = [];
  
  for (const ta of tokenAccounts.value) {
    const accountData = AccountLayout.decode(ta.account.data);
    const mintInfo = await connection.getAccountInfo(
      new PublicKey(accountData.mint)
    );
    
    if (!mintInfo) {
      throw new Error(`Failed to fetch mint info for ${accountData.mint}`);
    }
    
    const mintData = MintLayout.decode(mintInfo.data);

    tokens.push({
      mint: new PublicKey(accountData.mint),
      amount: Number(accountData.amount),
      decimals: mintData.decimals,
      tokenAccount: ta.pubkey,
    });
  }
  console.log("> All tokens info fetched:", tokens.length);
  return tokens;
}

