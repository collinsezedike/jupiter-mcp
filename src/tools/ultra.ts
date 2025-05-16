import {
	getOrder,
	executeOrder,
	getTokenBalances,
	getTokenMintsWarnings,
} from "../api/ultra";

import {
	GetOrderParamsSchema,
	ExecuteOrderParamsSchema,
	GetTokenBalancesParamsSchema,
	GetTokenMintsWarningsParamsSchema,
} from "../schemas";

export const ultraTools = [
	{
		name: "getOrder",
		description: "Get order details for a token swap",
		parameters: GetOrderParamsSchema,
		callback: getOrder,
	},
	{
		name: "executeOrder",
		description: "Execute a signed swap transaction",
		parameters: ExecuteOrderParamsSchema,
		callback: executeOrder,
	},
	{
		name: "getTokenBalances",
		description: "Get token balances for an address",
		parameters: GetTokenBalancesParamsSchema,
		callback: getTokenBalances,
	},
	{
		name: "getTokenMintsWarnings",
		description: "Get warnings about specific token mints",
		parameters: GetTokenMintsWarningsParamsSchema,
		callback: getTokenMintsWarnings,
	},
];
