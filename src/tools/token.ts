import * as fs from "fs";
import * as JSONStream from "jsonstream";

import { GetTokenMetadataFromTokenMint } from "../api/token";
import {
	addTokenMetadataToTokensJSONParamsSchema,
	GetTokenMintFromTokenNameParamsSchema,
	GetTokenMetadataFromTokenMintParamsSchema,
} from "../schemas";
import { TOKENS_JSON_FILEPATH } from "../utils";

interface Token {
	address: string;
	decimals: number;
	extensions: Record<string, any>;
	name: string;
	symbol: string;
	tags?: string[];
	logoURI?: string;
}

const getTokenMintFromTokenName = async ({
	tokenName,
}: typeof GetTokenMintFromTokenNameParamsSchema): Promise<string> => {
	return new Promise((resolve, reject) => {
		const readStream = fs.createReadStream(TOKENS_JSON_FILEPATH, {
			encoding: "utf8",
		});
		const stream = readStream.pipe(JSONStream.parse("*"));

		let resolved = false;

		stream.on("data", (data: Token) => {
			if (data.symbol === tokenName.toString()) {
				resolved = true;
				readStream.destroy();
				resolve(data.address);
			}
		});

		stream.on("end", () => {
			if (!resolved) {
				reject(new Error(`${tokenName} mint address not found.`));
			}
		});

		stream.on("error", (err: Error) => {
			if (!resolved) reject(err);
		});

		// In case the stream is destroyed before 'end'
		readStream.on("close", () => {
			if (!resolved) {
				reject(new Error(`${tokenName} mint address not found.`));
			}
		});
	});
};

const addTokenMetadataToTokensJSON = async ({
	address,
	name,
	symbol,
	decimals,
	extensions,
	tags,
	logoURI,
}: typeof addTokenMetadataToTokensJSONParamsSchema) => {
	try {
		const token: Token = {
			address: address.toString(),
			decimals: Number(decimals),
			extensions: extensions || {},
			name: name.toString(),
			symbol: symbol.toString(),
			tags: Array.isArray(tags) ? tags : undefined,
			logoURI: logoURI?.toString(),
		};

		const rawData = fs.readFileSync(TOKENS_JSON_FILEPATH, "utf-8");
		let tokens: Token[] = JSON.parse(rawData);

		const tokenAlreadyExists = tokens.some(
			(t: Token) => t.address === token.address.toString()
		);
		if (tokenAlreadyExists) {
			return JSON.stringify(
				`⚠️ Token with address ${token.address} already exists. Skipping.`
			);
		}

		tokens.push(token);
		fs.writeFileSync(TOKENS_JSON_FILEPATH, JSON.stringify(tokens, null, 2));
		return `✅ Token ${token.symbol} appended to solana_tokens.json`;
	} catch (error) {
		console.error(error);
		return JSON.stringify({
			message: "❌ Error appending token",
			error: error instanceof Error ? error.message : error,
		});
	}
};

export const tokenTools = [
	{
		name: "getTokenMintFromTokenName",
		description: "Get the mint address of a token by its name",
		parameters: GetTokenMintFromTokenNameParamsSchema,
		callback: getTokenMintFromTokenName,
	},
	{
		name: "getTokenMetadataFromTokenMint",
		description: "Get token metadata from mint address",
		parameters: GetTokenMetadataFromTokenMintParamsSchema,
		callback: GetTokenMetadataFromTokenMint,
	},
	{
		name: "addTokenMetadataToTokensJSON",
		description: "Add token metadata to solana_tokens.json",
		parameters: addTokenMetadataToTokensJSONParamsSchema,
		callback: addTokenMetadataToTokensJSON,
	},
];
