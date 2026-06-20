import { ChatAnthropic } from '@langchain/anthropic';
import { MemorySaver } from '@langchain/langgraph';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatOpenAI } from '@langchain/openai';

import type { KitConfig } from './config.js';
import { kitLine, yellow } from './theme.js';
import { tools } from './tools.js';

const MAX_RETRIES = 4;

interface RetryableError {
  status?: number;
}

function makeOnFailedAttempt() {
  let attempt = 0;
  return (error: RetryableError): void => {
    const status = error.status;
    if (typeof status === 'number' && status >= 400 && status < 500 && status !== 429) {
      throw error;
    }
    attempt += 1;
    const reason = status === 529 ? 'overloaded' : status ? `HTTP ${status}` : 'unreachable';
    const last = attempt > MAX_RETRIES;
    const tail = last ? 'giving up' : `retrying (${attempt}/${MAX_RETRIES}) ...`;
    console.log(kitLine(yellow(`model ${reason} on attempt ${attempt}; ${tail}`)));
  };
}

export function buildAgent(config: KitConfig, _ask: (q: string) => Promise<string>) {
  const retry = { maxRetries: MAX_RETRIES, onFailedAttempt: makeOnFailedAttempt() };

  const model =
    config.provider === 'anthropic'
      ? new ChatAnthropic({ model: config.model, apiKey: config.providerApiKey, ...retry })
      : new ChatOpenAI({ model: config.model, apiKey: config.providerApiKey, ...retry });

  return createReactAgent({
    llm: model,
    tools,
    checkpointSaver: new MemorySaver(),
  });
}
