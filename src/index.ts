import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { tools } from "./tools";

const server = new McpServer({
	name: "jupiter-swap",
	version: "1.0.0",
	capabilities: {
		resources: {},
		tools: {},
	},
});

tools
	.map((tool) => ({
		name: tool.name,
		description: tool.description,
		parameters: tool.parameters,
		handler: async (args: any) => {
			try {
				const result = await tool.callback(args);
				return {
					content: [
						{
							type: "text" as const,
							text: JSON.stringify(result),
						},
					],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text" as const,
							text:
								error instanceof Error
									? error.message
									: String(error),
						},
					],
					isError: true,
				};
			}
		},
	}))
	.forEach(({ name, description, parameters, handler }) => {
		server.tool(name, description, parameters, handler);
	});

async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("Weather MCP Server running on stdio");
}

main().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});
