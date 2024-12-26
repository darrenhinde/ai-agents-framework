export type ModelProvider = 'ollama' | 'openai' | 'google' | 'anthropic';

export interface ModelConfig {
  provider: ModelProvider;
  models: string[];
}

export const modelConfigs: ModelConfig[] = [
  { provider: 'google', models: ['gemini-1.5-flash-latest', 'gemini-1.5-pro-latest'] },
  { provider: 'openai', models: ['gpt-4o-mini', 'gpt-4o'] },
  { provider: 'ollama', models: ['llama3.2'] },
  { provider: 'anthropic', models: ['claude-3-sonnet-20240229', 'claude-3-opus-20240229'] },
]; 