import axios from "axios";
import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js";
import { getMint } from "@solana/spl-token";

import {
	GetOrderParamsSchema,
	ExecuteOrderParamsSchema,
	GetTokenMintsWarningsParamsSchema,
} from "../schemas";
import {
	hasSufficientGas,
	hasSufficientTokenAmount,
	RPC_URL,
	walletKeypair,
} from "../utils";

const JUP_API_URL = "https://lite-api.jup.ag/ultra/v1";

const headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

export const getOrder = async ({
	inputMint,
	outputMint,
	amount,
	slippageBps,
	taker,
}: typeof GetOrderParamsSchema) => {
	try {
		const connection = new Connection(RPC_URL, "confirmed");
		const inputMintPublicKey = new PublicKey(inputMint.toString());
		const inputMintInfo = await getMint(connection, inputMintPublicKey);
		const decimals = inputMintInfo.decimals;

		const amountFloat = parseFloat(amount.toString());
		if (isNaN(amountFloat)) {
			throw new Error("Invalid amount format");
		}
		const amountInt = Math.floor(amountFloat * Math.pow(10, decimals));

		if (
			!(await hasSufficientTokenAmount(inputMint.toString(), amountInt))
		) {
			throw new Error("Insufficient tokens avaiable to fill transaction");
		}

		const config = {
			method: "GET",
			url: `${JUP_API_URL}/order`,
			params: {
				inputMint: inputMint.toString(),
				outputMint: outputMint.toString(),
				amount: amountInt.toString(),
				slippageBps: slippageBps.toString(),
				taker: taker?.toString() || walletKeypair.publicKey.toString(),
			},
			headers,
		};

		const response = await axios.request(config);
		if (!response.data.transaction) {
			throw new Error(
				"No transaction field in response. Ensure taker address is valid."
			);
		}
		return JSON.stringify(response.data);
	} catch (error) {
		return JSON.stringify({
			message: "Failed to get order from Jupiter API",
			error: error instanceof Error ? error.message : error,
		});
	}
};

export const executeOrder = async ({
	transaction,
	requestId,
}: typeof ExecuteOrderParamsSchema) => {
	try {
		const txn = VersionedTransaction.deserialize(
			Buffer.from(transaction.toString(), "base64")
		);
		txn.sign([walletKeypair]);

		if (!(await hasSufficientGas(walletKeypair.publicKey, txn))) {
			throw new Error("Insufficient SOL avaiable to cover gas fees");
		}

		const signedTransaction = Buffer.from(txn.serialize()).toString(
			"base64"
		);

		const config = {
			method: "POST",
			url: `${JUP_API_URL}/execute`,
			data: { signedTransaction, requestId },
			headers,
		};
		const response = await axios.request(config);
		return JSON.stringify(response.data);
	} catch (error) {
		return JSON.stringify({
			message: "Failed to execute order on Jupiter API",
			error: error instanceof Error ? error.message : error,
		});
	}
};

export const getTokenMintsWarnings = async ({
	mints,
}: typeof GetTokenMintsWarningsParamsSchema) => {
	try {
		let config = {
			method: "GET",
			url: `${JUP_API_URL}/shield`,
			params: { mints },
			paramsSerializer: (params: Record<string, string[]>) => {
				return Object.entries(params)
					.map(([key, value]) => {
						if (Array.isArray(value)) {
							return `${key}=${value.join(",")}`;
						}
						return `${key}=${value}`;
					})
					.join("&");
			},
			headers,
		};

		const response = await axios.request(config);
		return JSON.stringify(response.data);
	} catch (error) {
		return JSON.stringify({
			message: "Failed to get token mints warnings from Jupiter API",
			error: error instanceof Error ? error.message : error,
		});
	}
};
