import {
	createTriggerOrder,
	executeTriggerOrder,
	cancelTriggerOrder,
	cancelTriggerOrders,
	getTriggerOrders,
} from "../api/trigger";

import {
	CreateTriggerOrderParamsSchema,
	ExecuteOrderParamsSchema,
	CancelTriggerOrderParamsSchema,
	CancelTriggerOrdersParamsSchema,
	GetTriggerOrdersParamsSchema,
} from "../schemas";

export const triggerTools = [
	{
		name: "createTriggerOrder",
		description:
			"Creates a limit or trigger order or swap. The order must be worth at least $5. \
			Fetch the inputMint token price and multiply it by the makingAmount to get the order value. \
			If the order is worth less than $5, reject the request and response saying that 'Order must be worth at least $5'. \
			Otherwise, proceed with the order creation.",
		parameters: CreateTriggerOrderParamsSchema,
		callback: createTriggerOrder,
	},
	{
		name: "executeTriggerOrder",
		description: "Execute a trigger order",
		parameters: ExecuteOrderParamsSchema,
		callback: executeTriggerOrder,
	},
	{
		name: "cancelTriggerOrder",
		description: "Cancel a single trigger order",
		parameters: CancelTriggerOrderParamsSchema,
		callback: cancelTriggerOrder,
	},
	{
		name: "cancelTriggerOrders",
		description: "Cancel multiple trigger orders",
		parameters: CancelTriggerOrdersParamsSchema,
		callback: cancelTriggerOrders,
	},
	{
		name: "getTriggerOrders",
		description: "Get trigger orders for a user",
		parameters: GetTriggerOrdersParamsSchema,
		callback: getTriggerOrders,
	},
];
