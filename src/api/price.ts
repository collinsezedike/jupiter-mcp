import axios from "axios";

import { GetPriceParams } from "../schemas";

const JUP_API_URL = "https://lite-api.jup.ag/price/v2";

const headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

export const getPrice = async ({ ids }: GetPriceParams) => {
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
		return response.data;
	} catch (error) {
		console.error(error);
	}
};
