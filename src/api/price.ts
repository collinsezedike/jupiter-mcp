import axios from "axios";

import { GetPriceParamsSchema } from "../schemas";

const JUP_API_URL = "https://lite-api.jup.ag/price/v2";

const headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

export const getPrice = async ({ ids }: typeof GetPriceParamsSchema) => {
	try {
		let config = {
			method: "GET",
			url: `${JUP_API_URL}`,
			params: { ids },
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
			message: "Failed to get price data from Jupiter API",
			error: error instanceof Error ? error.message : error,
		});
	}
};
