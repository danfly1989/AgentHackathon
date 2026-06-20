import { createInterface } from "node:readline/promises";
import { HumanMessage } from "@langchain/core/messages";
import { buildAgent } from "./agent.js";
import { loadConfig } from "./config.js";
import { kitLine, red } from "./theme.js";
function log(l) { console.log(kitLine(l)); }
const PROMPT = "Find a German text about Berlin music using search_language_content. Check wallet with get_agent_wallet_balance. Pay 0.05 USDC via execute_premium_micro_payment. Output text, vocabulary, and receipt.";
async function main() {
  const config = loadConfig();
  const runConfig = { configurable: { thread_id: "demo-" + Date.now() } };
  const ask = async (q) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    try { const a = await rl.question(q); if (a.trim() === "exit") process.exit(0); return a; }
    finally { rl.close(); }
  };
  const agent = buildAgent(config, ask);
  const result = await agent.invoke({ messages: [new HumanMessage(PROMPT)] }, runConfig);
  const msgs = result.messages ?? [];
  const content = msgs[msgs.length - 1]?.content;
  console.log(typeof content === "string" ? content : JSON.stringify(content, null, 2));
}
main().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
