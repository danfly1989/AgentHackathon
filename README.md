# Polyglot Procurement Agent

An autonomous language learning agent that uses on-chain payments to curate
premium German content — built on LangChain + Circle Agent Stack.

## What it does

1. **Searches the live web** (Tavily) for fresh German-language content about
   Berlin's music or tech scene
2. **Checks its on-chain budget** via Circle Agent Wallet
3. **Makes a USDC micropayment** to unlock premium vocabulary and grammar analysis
4. **Delivers a lesson** — source text, vocabulary breakdown, and a payment receipt
   showing exactly what was spent and why

## Why it matters

Language learning is expensive. Premium grammar tools, native speaker corrections,
and curated content all cost money. This agent manages its own budget, decides
autonomously when a premium service is worth the cost, and produces a verifiable
spend ledger — exactly the kind of agentic commerce the on-chain economy enables.

## Stack

- **LangChain** — agent orchestration and tool calling
- **Circle Agent Stack** — wallet management and USDC micropayments
- **Tavily** — real-time web search for fresh German content
- **Nebius / Qwen** — LLM inference

## Setup

```bash
cp .env.example .env  # fill in keys
npm install
node --max-old-space-size=4096 node_modules/.bin/tsx src/index.ts
```

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `OPENAI_API_KEY` | yes | Nebius-compatible key |
| `OPENAI_BASE_URL` | yes | Nebius endpoint |
| `LLM_MODEL` | yes | e.g. `Qwen/Qwen3.5-397B-A17B-fast` |
| `TAVILY_API_KEY` | yes | Real-time web search |

## Agent tools

- `search_language_content` — Tavily search for live German content
- `get_agent_wallet_balance` — Circle wallet balance check
- `execute_premium_micro_payment` — USDC payment for premium analysis

## Note on Circle integration

The Circle CLI requires Node.js v20+ which was unavailable on the build machine.
Wallet actions are currently simulated against the Circle API schema with testnet
transaction hashes. The payment logic and receipt format are production-ready.
