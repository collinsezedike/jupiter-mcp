# Jupiter MCP – Token Swap MCP via Jupiter API

Jupiter MCP is a TypeScript/Node.js MCP server that facilitates instant token swaps and limit orders seamlessly on Solana using [Jupiter API](https://dev.jup.ag/docs/). It provides utilities for managing Solana token metadata, token balance checks, token lists, and wallet-based operations using environment-based configuration.

This MCP abstracts the complexity of on-chain interactions by providing a structured, context-aware layer for initiating and managing token swap operations. It is designed to be easily integrated with LLM agents, bots, or apps that require secure and reliable access to decentralized liquidity.

## Features

- 🔁 **Token Swapping**: Execute swaps across the best available routes using Jupiter’s liquidity aggregator.
- 📦 **Context-Aware Requests**: Encodes user intent and wallet info into structured commands for model-to-protocol interaction.
- 🔐 **Secure Transaction Handling**: Signs and sends transactions only with explicit user approval.
- ⚙️ **Wallet Initialization:** Securely initialize a Solana wallet from a private key.
- 🤖 **LLM-Ready**: Built to support AI agents in understanding and executing financial actions through structured model context.
- 💼 **Token Metadata Management:** Add and retrieve token metadata from a JSON file.

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Claude for Deskop](https://claude.ai/download)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/collinsezedike/jupiter-mcp.git
   cd jupiter-mcp
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Build the project:**

   ```bash
   npm run build
   # or
   yarn run build
   ```

4. **Configure the MCP for Claude for Desktop:**  
    Add the MCP configuration to `C:\Users\{User}\AppData\Roaming\Claude\claude_desktop_config.json`

     ```json
    "jupiter-mcp": {
        "command": "node",
        "args": [
            "<PROJECT_ABSOLUTE_FILEPATH>\\build\\index.js"
        ],
        "env": {
            "PRIVATE_KEY": "<base58-encoded private key>",
            "TOKENS_JSON_FILEPATH": "<PROJECT_ABSOLUTE_FILEPATH>\\solana_tokens.json"
        }
    }
     ```

    [Follow this guide](https://modelcontextprotocol.io/quickstart/server#testing-your-server-with-claude-for-desktop-2)

5. **Run the application:**
    Head to open Claude for Desktop and verify that the Jupiter MCP tools has been added. Try asking the Chatbot for the price of JUP.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
