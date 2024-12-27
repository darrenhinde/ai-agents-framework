import type { CoreTool, LanguageModelV1 } from 'ai';
import type { LangfuseTraceClient, Langfuse } from 'langfuse';
import type { z } from 'zod';

// Agent Configuration Types
export interface AgentConfig {
  name: string;
  traceId?: string;
  trace?: LangfuseTraceClient;
  metadata?: Record<string, unknown>;
  createNewTrace?: boolean;
  langfuse?: Langfuse;
  parentTraceId?: string;
  isServerless?: boolean;
}

export interface AgentMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  id?: string;
  name?: string;
}

export interface AgentOptions {
  maxSteps?: number;
  systemPrompt: string;
  tools?: Record<string, CoreTool<z.ZodType<Record<string, unknown>>, unknown>>;
  model: LanguageModelV1;
  requireStructuredOutput?: boolean;
  messages?: AgentMessage[];
  maxTokens?: number;
  temperature?: number;
}

// Message and Response Types
export interface MessageContent {
  type: string;
  text?: string;
  toolCallId?: string;
  toolName?: string;
  args?: Record<string, unknown>;
  toolResults?: unknown;
}

export interface Message {
  role: string;
  content: MessageContent[];
}

export interface AgentResponse {
  messages?: Message[];
  toolResults?: Record<string, unknown>;
  structuredOutput?: unknown;
  [key: string]: unknown;
}

// Debug Configuration
export interface DebugOptions {
  enabled: boolean;
  level?: 'info' | 'debug' | 'verbose';
  logToolCalls?: boolean;
  logTraces?: boolean;
  logResponses?: boolean;
}

export const defaultDebugOptions: DebugOptions = {
  enabled: false,
  level: 'info',
  logToolCalls: true,
  logTraces: true,
  logResponses: true
}; 