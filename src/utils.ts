import bs58 from "bs58";
import dotenv from "dotenv";
import { ZodString } from "zod";
import {
	Connection,
	Keypair,
	PublicKey,
	VersionedTransaction,
} from "@solana/web3.js";

import { getTokenBalances } from "./api/ultra";

dotenv.config();

interface TokenData {
	amount: string;
	uiAmount: number;
	slot: number;
	isFrozen: boolean;
}

export const RPC_URL =
	process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
export const TOKENS_JSON_FILEPATH = process.env.TOKENS_JSON_FILEPATH as string;
export const PRIVATE_KEY = process.env.PRIVATE_KEY as string;

if (!TOKENS_JSON_FILEPATH || !PRIVATE_KEY) {
	throw new Error(
		"TOKENS_JSON_FILEPATH or PRIVATE_KEY is not defined in environment variables"
	);
}

export let walletKeypair: Keypair;

async function initializeWallet() {
	try {
		walletKeypair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
	} catch (error: any) {
		throw new Error(`❌ Failed to initialize wallet: ${error.message}`);
	}
}
// Initialize the wallet immediately
initializeWallet();

export const hasSufficientTokenAmount = async (
	address: ZodString,
	amount: number
) => {
	const response = await getTokenBalances({ address });
	const tokenData = Object.values(JSON.parse(response))[0] as TokenData;
	if (!tokenData) {
		throw new Error("No token data found for the given address.");
	}
	return amount >= tokenData.uiAmount;
};

export const hasSufficientGas = async (
	pubkey: PublicKey,
	txn: VersionedTransaction
) => {
	const connection = new Connection(RPC_URL, "finalized");
	const balance = await connection.getBalance(pubkey);
	const estimatedFee = await connection.getFeeForMessage(txn.message);
	if (!estimatedFee.value) {
		throw new Error(`Invalid estimated fee response ${estimatedFee}`);
	}

	return balance >= estimatedFee.value;
};
