import bs58 from "bs58";
import dotenv from "dotenv";
import {
	Connection,
	Keypair,
	PublicKey,
	VersionedTransaction,
} from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import { getPrice } from "./api/price";
import { ZodString } from "zod";

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

async function getTokenBalance(
	walletAddress: string,
	mintAddress: string
): Promise<number> {
	try {
		const walletPubKey = new PublicKey(walletAddress);
		const mintPubKey = new PublicKey(mintAddress);
		const ata = await getAssociatedTokenAddress(mintPubKey, walletPubKey);

		const connection = new Connection(RPC_URL, "confirmed");
		const tokenAccount = await getAccount(connection, ata);

		return Number(tokenAccount.amount);
	} catch (error) {
		console.error("Error fetching token balance:", error);
		return 0;
	}
}

export const hasSufficientTokenAmount = async (
	mintAddress: string,
	amount: number
) => {
	const walletAddress = walletKeypair.publicKey.toString();
	const balance = await getTokenBalance(walletAddress, mintAddress);
	return balance >= amount;
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
