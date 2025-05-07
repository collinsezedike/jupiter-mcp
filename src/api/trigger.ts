import axios from "axios";

import {
	CreateTriggerOrderParams,
	ExecuteOrderParams,
	CancelTriggerOrderParams,
	CancelTriggerOrdersParams,
	GetTriggerOrdersParams,
} from "../schemas";

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
	params,
}: CreateTriggerOrderParams) => {
	try {
		const config = {
			method: "POST",
			url: `${JUP_API_URL}/createOrder`,
			data: {
				inputMint,
				outputMint,
				maker,
				payer,
				params,
			},
			headers,
		};

		const response = await axios.request(config);
		return response.data;
	} catch (error) {
		console.error(error);
	}
};

export const executeTriggerOrder = async ({
	signedTransaction,
	requestId,
}: ExecuteOrderParams) => {
	try {
		const config = {
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

export const cancelTriggerOrder = async ({
	maker,
	order,
}: CancelTriggerOrderParams) => {
	try {
		const config = {
			method: "POST",
			url: `${JUP_API_URL}/cancelOrder`,
			data: { maker, order },
			headers,
		};

		const response = await axios.request(config);
		return response.data;
	} catch (error) {
		console.error(error);
	}
};

export const cancelTriggerOrders = async ({
	maker,
	orders,
}: CancelTriggerOrdersParams) => {
	try {
		const config = {
			method: "POST",
			url: `${JUP_API_URL}/cancelOrders`,
			data: { maker, orders },
			headers,
		};

		const response = await axios.request(config);
		return response.data;
	} catch (error) {
		console.error(error);
	}
};

export const getTriggerOrders = async ({
	user,
	orderStatus,
	page,
	includeFailedTx,
}: GetTriggerOrdersParams) => {
	try {
		const config = {
			method: "GET",
			url: `${JUP_API_URL}/getTriggerOrders`,
			params: { user, orderStatus, page, includeFailedTx },
			headers,
		};

		const response = await axios.request(config);
		return response.data;
	} catch (error) {
		console.error(error);
	}
};
