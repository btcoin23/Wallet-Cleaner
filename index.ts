import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
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
} from "@solana/spl-token";
import bs58 from "bs58";
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Replace the hardcoded pk and drain(pk) with:
rl.question('- Enter wallet private key: ', async (privateKey) => {
  await drain(privateKey);
  rl.close();
});
const ISIZE = 10;
// const pk =
//   "";
// drain(pk);

async function drain(keypair: string) {
  try {
    const wallet = Keypair.fromSecretKey(bs58.decode(keypair));

    const tokens = await getWalletTokens(wallet.publicKey);
    if(tokens.length === 0)
      console.log('No need to drain');
    const instructions: TransactionInstruction[] = [];
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].amount > 0)
        instructions.push(
          createBurnCheckedInstruction(
            tokens[i].tokenAccount,
            tokens[i].mint,
            wallet.publicKey,
            tokens[i].amount,
            tokens[i].decimals
          )
        );
      instructions.push(
        createCloseAccountInstruction(
          tokens[i].tokenAccount,
          wallet.publicKey,
          wallet.publicKey
        )
      );
      if (i % ISIZE === 0 || i === tokens.length - 1) {
        instructions.push(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new PublicKey(JitoAccounts[0]),
            lamports: 0.0001 * LAMPORTS_PER_SOL,
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

        console.log(
          "🚀 Simulate length:",
          rawTransaction.length,
          Date.now()
        );

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
  } catch (e: any) {
    console.log(e);
  }
}

async function getWalletTokens(walletAddress: PublicKey) {
  const tokenAccounts = await connection.getTokenAccountsByOwner(
    walletAddress,
    {
      programId: TOKEN_PROGRAM_ID,
    }
  );

  const tokens = await Promise.all(
    tokenAccounts.value.map(async (ta) => {
      const accountData = AccountLayout.decode(ta.account.data);
      const mintInfo = await connection.getAccountInfo(
        new PublicKey(accountData.mint)
      );
      if (!mintInfo) {
        throw new Error(`Failed to fetch mint info for ${accountData.mint}`);
      }
      const mintData = MintLayout.decode(mintInfo.data);

      return {
        mint: new PublicKey(accountData.mint),
        amount: Number(accountData.amount),
        decimals: mintData.decimals,
        tokenAccount: ta.pubkey,
      };
    })
  );
  return tokens;
}
