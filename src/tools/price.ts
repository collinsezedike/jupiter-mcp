import { getPrice } from "../api/price";
import { GetPriceParamsSchema } from "../schemas";

export const priceTools = [
	{
		name: "getPrice",
		description: "Get price information for tokens",
		parameters: GetPriceParamsSchema,
		callback: getPrice,
	},
];
