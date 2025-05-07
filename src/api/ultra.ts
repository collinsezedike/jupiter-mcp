import axios from "axios";

import {
	GetOrderParams,
	ExecuteOrderParams,
	GetTokenInfoParams,
	GetTokenBalancesParams,
} from "../schemas";

const JUP_API_URL = "https://lite-api.jup.ag/ultra/v1";

const headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

export const getOrder = async ({
	inputMint,
	outputMint,
	amount,
}: GetOrderParams) => {
	try {
		const config = {
			method: "GET",
			url: `${JUP_API_URL}/order`,
			params: {
				inputMint,
				outputMint,
				amount,
			},
			headers,
		};

		const response = await axios.request(config);
		return response.data;
	} catch (error) {
		console.error(error);
	}
};

export const executeOrder = async ({
	signedTransaction,
	requestId,
}: ExecuteOrderParams) => {
	try {
		let config = {
			method: "POST",
			url: `${JUP_API_URL}/execute`,
			data: { signedTransaction, requestId },
			headers,
		};

		const response = await axios.request(config);
		return response.data;
	} catch (error) {
		console.error(error);
	}
};

export const getTokenBalances = async ({ address }: GetTokenBalancesParams) => {
	try {
		let config = {
			method: "GET",
			url: `${JUP_API_URL}/balances`,
			params: { address },
			headers,
		};

		const response = await axios.request(config);
		return response.data;
	} catch (error) {
		console.error(error);
	}
};

export const getTokenInfo = async ({ mints }: GetTokenInfoParams) => {
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
		return response.data;
	} catch (error) {
		console.error(error);
	}
};

export const getRouter = async () => {
	try {
		let config = {
			method: "GET",
			url: `${JUP_API_URL}/routers`,
			headers,
		};

		const response = await axios.request(config);
		return response.data;
	} catch (error) {
		console.error(error);
	}
};
