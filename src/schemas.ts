import { z } from "zod";

export const GetOrderParamsSchema = {
	inputMint: z.string(),
	outputMint: z.string(),
	amount: z.string(),
	slippageBps: z.string().optional().default("50"),
	taker: z.string().optional(),
};

export const ExecuteOrderParamsSchema = {
	transaction: z.string(),
	requestId: z.string(),
};

export const GetTokenBalancesParamsSchema = {
	address: z.string(),
};

export const GetTokenMintsWarningsParamsSchema = {
	mints: z.array(z.string()),
};

export const CreateTriggerOrderParamsSchema = {
	inputMint: z.string(),
	outputMint: z.string(),
	maker: z.string(),
	payer: z.string(),
	params: {
		makingAmount: z.string(),
		takingAmount: z.string(),
		slippageBps: z.string().optional(),
		expiredAt: z.string().optional(),
		feeBps: z.string().optional(),
	},
};

export const CancelTriggerOrderParamsSchema = {
	maker: z.string(),
	order: z.string(),
};

export const CancelTriggerOrdersParamsSchema = {
	maker: z.string(),
	orders: z.array(z.string()),
};

export const GetTriggerOrdersParamsSchema = {
	user: z.string(),
	orderStatus: z.enum(["active", "history"]),
	page: z.number().optional(),
	includeFailedTx: z.boolean().optional(),
};

export const GetPriceParamsSchema = {
	ids: z.array(z.string()),
};

export const GetTokenMintFromTokenNameParamsSchema = {
	tokenName: z.string(),
};

export const GetTokenMetadataFromTokenMintParamsSchema = {
	mint_address: z.string(),
};

export const addTokenMetadataToTokensJSONParamsSchema = {
	address: z.string(),
	decimals: z.number(),
	extensions: z.record(z.any()),
	name: z.string(),
	symbol: z.string(),
	tags: z.array(z.string()).optional(),
	logoURI: z.string().optional(),
};
