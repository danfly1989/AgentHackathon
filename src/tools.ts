import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// Helper to log beautiful terminal logs matching your kit's theme
function logToolAction(name: string, details: string) {
  console.log(`\x1b[36m[Tool: ${name}]\x1b[0m ${details}`);
}

/**
 * 1. Tavily Search Tool for finding localized, fresh text
 * Perfect for hunting down fresh German/Music content from the web!
 */
export const searchLanguageContent = tool(
  async ({ query }) => {
    const apiKey = process.env.TAVILY_API_KEY;
    logToolAction('Tavily Search', `Looking for fresh context: "${query}"`);

    if (!apiKey) {
      return JSON.stringify({ error: "Missing TAVILY_API_KEY in .env file." });
    }

    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: apiKey,
          query: `${query} language learning material or news`,
          search_depth: 'advanced',
          include_answer: true,
          max_results: 3
        })
      });

      const data = await response.json();
      return JSON.stringify(data);
    } catch (error: any) {
      return JSON.stringify({ error: `Search failed: ${error.message}` });
    }
  },
  {
    name: 'search_language_content',
    description: 'Searches the live web using Tavily for fresh, relevant articles or culture snippets for language target text.',
    schema: z.object({
      query: z.string().describe('The search terms (e.g., "Berlin electronic music scene news in German").'),
    }),
  }
);

/**
 * 2. Circle Wallet Balance Checker
 * Validates agent's operational budget using Circle Developer API
 */
export const getAgentWalletBalance = tool(
  async () => {
    const apiKey = process.env.CIRCLE_API_KEY;
    const walletId = process.env.CIRCLE_WALLET_ID;
    logToolAction('Circle Balance Check', `Reading wallet balance...`);

    if (!apiKey || !walletId) {
      return JSON.stringify({ 
        balance: "15.50", 
        currency: "USDC",
        note: "Fallback Mock: Set CIRCLE_API_KEY & CIRCLE_WALLET_ID for live chain data." 
      });
    }

    try {
      const response = await fetch(`https://api.circle.com/v1/w3s/developer/wallets/${walletId}/balances`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return JSON.stringify(data);
    } catch (error: any) {
      return JSON.stringify({ error: `Failed to query Circle balances: ${error.message}` });
    }
  },
  {
    name: 'get_agent_wallet_balance',
    description: 'Checks the available USDC and gas token balance inside the Agent Programmable Wallet via Circle API.',
    schema: z.object({}),
  }
);

/**
 * 3. Circle Micro-Payment Processing Tool
 * Charges a micro-fee from the agent's smart wallet to pull or trigger premium content
 */
export const executePremiumMicroPayment = tool(
  async ({ amountUsdc, purpose }) => {
    logToolAction('Circle Micro-Payment', `Initiating payment of $${amountUsdc} USDC for: ${purpose}`);
    
    const apiKey = process.env.CIRCLE_API_KEY;
    if (!apiKey) {
      // Return a perfect simulated successful transaction hash if keys are not ready yet
      const randomHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
      return JSON.stringify({
        status: "SUCCESS",
        txHash: randomHash,
        amount: amountUsdc,
        destinationService: "Premium SLA Vocabulary & Grammar Generator",
        simulated: true
      });
    }

    // Live execution layout if you paste keys tomorrow
    try {
      const response = await fetch('https://api.circle.com/v1/w3s/developer/transactions/transfer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idempotencyKey: crypto.randomUUID(),
          walletId: process.env.CIRCLE_WALLET_ID,
          destinationAddress: "0xMockSlaServiceContractAddressHere...",
          amounts: [amountUsdc.toString()],
          feeLevel: "LOW",
          tokenId: "USD-COIN-TESTNET"
        })
      });
      const data = await response.json();
      return JSON.stringify(data);
    } catch (error: any) {
      return JSON.stringify({ error: `Circle processing transaction error: ${error.message}` });
    }
  },
  {
    name: 'execute_premium_micro_payment',
    description: 'Triggers an automated web3 payment of testnet USDC using the Circle stack to secure access to premium language tools.',
    schema: z.object({
      amountUsdc: z.number().describe('The decimal fee amount to spend (e.g., 0.05).'),
      purpose: z.string().describe('A brief note justifying why the expense is needed for the lesson setup.'),
    }),
  }
);

// Bundle all working tools together to drop into the main agent framework
export const tools = [searchLanguageContent, getAgentWalletBalance, executePremiumMicroPayment];
