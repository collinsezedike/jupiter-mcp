import axios from "axios";
import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js";
import { getMint } from "@solana/spl-token";

import {
	CreateTriggerOrderParamsSchema,
	ExecuteOrderParamsSchema,
	CancelTriggerOrderParamsSchema,
	CancelTriggerOrdersParamsSchema,
	GetTriggerOrdersParamsSchema,
} from "../schemas";
import {
	RPC_URL,
	walletKeypair,
	hasSufficientGas,
	hasSufficientTokenAmount,
} from "../utils";

const JUP_API_URL = "https://lite-api.jup.ag/trigger/v1";

const headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

export const createTriggerOrder = async ({
	inputMint,
	outputMint,
	maker,
	payer,
	makingAmount,
	takingAmount,
}: typeof CreateTriggerOrderParamsSchema) => {
	try {
		const connection = new Connection(RPC_URL, "confirmed");

		const inputMintPublicKey = new PublicKey(inputMint.toString());
		const inputMintInfo = await getMint(connection, inputMintPublicKey);
		const inputDecimals = inputMintInfo.decimals;

		const outputMintPublicKey = new PublicKey(outputMint.toString());
		const outputMintInfo = await getMint(connection, outputMintPublicKey);
		const outputDecimals = outputMintInfo.decimals;

		const makingAmountFloat = parseFloat(makingAmount.toString());
		const takingAmountFloat = parseFloat(takingAmount.toString());
		if (isNaN(makingAmountFloat) || isNaN(takingAmountFloat)) {
			throw new Error("Invalid amount format");
		} else if (makingAmountFloat <= 0.0 || takingAmountFloat <= 0.0) {
			throw new Error("Making and taking amounts must be greater than 0");
		}

		const makingAmountInt = Math.floor(
			makingAmountFloat * Math.pow(10, inputDecimals)
		);
		const takingAmountInt = Math.floor(
			makingAmountFloat * Math.pow(10, outputDecimals)
		);

		if (
			!(await hasSufficientTokenAmount(
				inputMint.toString(),
				makingAmountInt
			))
		) {
			throw new Error("Insufficient tokens avaiable to fill transaction");
		}

		const config = {
			method: "POST",
			url: `${JUP_API_URL}/createOrder`,
			data: {
				inputMint,
				outputMint,
				maker: maker?.toString() || walletKeypair.publicKey.toString(),
				payer: payer?.toString() || walletKeypair.publicKey.toString(),
				params: {
					takingAmount: takingAmountInt.toString(),
					makingAmount: makingAmountInt.toString(),
				},
			},
			headers,
		};

		const response = await axios.request(config);
		return JSON.stringify(response.data);
	} catch (error) {
		console.error("Error creating trigger order:", error);
		return JSON.stringify({
			message: "Failed to create trigger order on Jupiter API",
			error: error instanceof Error ? error.message : error,
		});
	}
};

export const executeTriggerOrder = async ({
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
		console.error("Error executing trigger order:", error);
		return JSON.stringify({
			message: "Failed to execute trigger order on Jupiter API",
			error: error instanceof Error ? error.message : error,
		});
	}
};

export const cancelTriggerOrder = async ({
	maker,
	order,
}: typeof CancelTriggerOrderParamsSchema) => {
	try {
		const config = {
			method: "POST",
			url: `${JUP_API_URL}/cancelOrder`,
			data: {
				maker: maker?.toString() || walletKeypair.publicKey.toString(),
				order,
			},
			headers,
		};

		const response = await axios.request(config);
		return JSON.stringify(response.data);
	} catch (error) {
		return JSON.stringify({
			message: "Failed to cancel trigger order on Jupiter API",
			error: error instanceof Error ? error.message : error,
		});
	}
};

export const cancelTriggerOrders = async ({
	maker,
	orders,
}: typeof CancelTriggerOrdersParamsSchema) => {
	try {
		const config = {
			method: "POST",
			url: `${JUP_API_URL}/cancelOrders`,
			data: {
				maker: maker?.toString() || walletKeypair.publicKey.toString(),
				orders,
			},
			headers,
		};

		const response = await axios.request(config);
		return JSON.stringify(response.data);
	} catch (error) {
		return JSON.stringify({
			message: "Failed to cancel trigger orders on Jupiter API",
			error: error instanceof Error ? error.message : error,
		});
	}
};

export const getTriggerOrders = async ({
	user,
	orderStatus,
	page,
	includeFailedTx,
}: typeof GetTriggerOrdersParamsSchema) => {
	try {
		const config = {
			method: "GET",
			url: `${JUP_API_URL}/getTriggerOrders`,
			params: {
				user: user?.toString() || walletKeypair.publicKey.toString(),
				orderStatus,
				page,
				includeFailedTx,
			},
			headers,
		};

		const response = await axios.request(config);
		return JSON.stringify(response.data);
	} catch (error) {
		return JSON.stringify({
			message: "Failed to get trigger orders from Jupiter API",
			error: error instanceof Error ? error.message : error,
		});
	}
};
