import dotenv from 'dotenv';
dotenv.config();

export type LLMProvider = 'openai' | 'anthropic';

export interface KitConfig {
  provider: LLMProvider;
  providerApiKey: string;
  model: string;
}

const DEFAULT_ANTHROPIC_MODEL = 'claude-3-5-sonnet-latest';
const DEFAULT_OPENAI_MODEL = 'gpt-4o'; // Replaced fallback model string with stable gpt-4o

export function loadConfig(): KitConfig {
  const env = process.env;

  let provider: LLMProvider;
  let providerApiKey: string;
  let model: string;

  if (env.ANTHROPIC_API_KEY && env.ANTHROPIC_API_KEY.trim() !== '') {
    provider = 'anthropic';
    providerApiKey = env.ANTHROPIC_API_KEY;
    model = env.LLM_MODEL ?? DEFAULT_ANTHROPIC_MODEL;
  } else if (env.OPENAI_API_KEY && env.OPENAI_API_KEY.trim() !== '') {
    provider = 'openai';
    providerApiKey = env.OPENAI_API_KEY;
    model = env.LLM_MODEL ?? DEFAULT_OPENAI_MODEL;
  } else {
    throw new Error(
      'No LLM provider key found. Please set ANTHROPIC_API_KEY or OPENAI_API_KEY in your .env file.',
    );
  }

  return {
    provider,
    providerApiKey,
    model,
  };
}
