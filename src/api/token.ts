import axios from "axios";

import { GetTokenMetadataFromTokenMintParamsSchema } from "../schemas";

const JUP_API_URL = "https://lite-api.jup.ag/tokens/v1";

const headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

export const GetTokenMetadataFromTokenMint = async ({
	mint_address,
}: typeof GetTokenMetadataFromTokenMintParamsSchema) => {
	try {
		let config = {
			method: "GET",
			url: `${JUP_API_URL}/tokens/${mint_address}`,
			headers,
		};

		const response = await axios.request(config);
		return JSON.stringify(response.data);
	} catch (error) {
		return JSON.stringify({
			message: "Failed to get token metadata from Jupiter API",
			error: error instanceof Error ? error.message : error,
		});
	}
};
