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
		description: "Create a new trigger order",
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
