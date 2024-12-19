import { Connection } from '@solana/web3.js'
import dotenv from 'dotenv'
dotenv.config()

const RPC_URL = process.env.RPC_URL||'https://api.mainnet-beta.solana.com';
export const connection = new Connection(RPC_URL)
