export interface GetOrderParams {
	inputMint: string;
	outputMint: string;
	amount: string;
	taker?: string;
}

export interface ExecuteOrderParams {
	signedTransaction: string;
	requestId: string;
}

export interface GetTokenBalancesParams {
	address: string;
}

export interface GetTokenInfoParams {
	mints: string[];
}

export interface CreateTriggerOrderParams {
	inputMint: string;
	outputMint: string;
	maker: string;
	payer: string;
	params: {
		makingAmount: string;
		takingAmount: string;
		slippageBps?: string;
		expiredAt?: string;
		feeBps?: string;
	};
}

export interface CancelTriggerOrderParams {
	maker: string;
	order: string;
}

export interface CancelTriggerOrdersParams {
	maker: string;
	orders: string[];
}

export interface GetTriggerOrdersParams {
	user: string;
	orderStatus: "active" | "history";
	page?: number;
	includeFailedTx?: boolean;
}

export interface GetPriceParams {
	ids: string[];
}
