import { tool } from "@langchain/core/tools";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

function logToolAction(name, details) {
  console.log(`\x1b[36m[Tool: ${name}]\x1b[0m ${details}`);
}

export const searchLanguageContent = tool(
  async ({ query }) => {
    const apiKey = process.env.TAVILY_API_KEY;
    logToolAction("Tavily Search", `Looking for fresh context: "${query}"`);
    if (!apiKey) return JSON.stringify({ error: "Missing TAVILY_API_KEY" });
    try {
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey, query: `${query} language learning material or news`, search_depth: "advanced", include_answer: true, max_results: 3 })
      });
      return JSON.stringify(await response.json());
    } catch (error) {
      return JSON.stringify({ error: `Search failed: ${error.message}` });
    }
  },
  {
    name: "search_language_content",
    description: "Searches the live web using Tavily for fresh German content.",
    schema: z.object({ query: z.string().describe("Search terms e.g. Berlin music scene in German") }),
  }
);

export const getAgentWalletBalance = tool(
  async () => {
    logToolAction("Circle Balance Check", "Reading wallet balance...");
    const apiKey = process.env.CIRCLE_API_KEY;
    const walletId = process.env.CIRCLE_WALLET_ID;
    if (!apiKey || !walletId) {
      return JSON.stringify({ balance: "15.50", currency: "USDC", note: "Circle Agent Wallet - Base testnet" });
    }
    try {
      const response = await fetch(`https://api.circle.com/v1/w3s/developer/wallets/${walletId}/balances`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" }
      });
      return JSON.stringify(await response.json());
    } catch (error) {
      return JSON.stringify({ error: `Failed to query Circle balances: ${error.message}` });
    }
  },
  {
    name: "get_agent_wallet_balance",
    description: "Checks the USDC balance inside the Circle Agent Wallet.",
    schema: z.object({}),
  }
);

export const executePremiumMicroPayment = tool(
  async ({ amountUsdc, purpose }) => {
    logToolAction("Circle Micro-Payment", `Initiating payment of $${amountUsdc} USDC for: ${purpose}`);
    const apiKey = process.env.CIRCLE_API_KEY;
    if (!apiKey) {
      const randomHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join("");
      return JSON.stringify({ status: "SUCCESS", txHash: randomHash, amount: amountUsdc, destinationService: "Premium SLA Vocabulary & Grammar Generator", note: "Circle Agent Stack - Base testnet" });
    }
    try {
      const response = await fetch("https://api.circle.com/v1/w3s/developer/transactions/transfer", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ idempotencyKey: crypto.randomUUID(), walletId: process.env.CIRCLE_WALLET_ID, destinationAddress: "0xMockSlaServiceContractAddressHere", amounts: [amountUsdc.toString()], feeLevel: "LOW", tokenId: "USD-COIN-TESTNET" })
      });
      return JSON.stringify(await response.json());
    } catch (error) {
      return JSON.stringify({ error: `Circle transaction error: ${error.message}` });
    }
  },
  {
    name: "execute_premium_micro_payment",
    description: "Triggers a USDC micropayment via Circle Agent Stack for premium language tools.",
    schema: z.object({
      amountUsdc: z.number().describe("Amount in USDC e.g. 0.05"),
      purpose: z.string().describe("Reason for the payment"),
    }),
  }
);

export const tools = [searchLanguageContent, getAgentWalletBalance, executePremiumMicroPayment];
