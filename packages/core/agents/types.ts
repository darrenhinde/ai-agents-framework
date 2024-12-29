import { type AIStreamCallbacksAndOptions } from 'ai';
import type {  LangfuseTraceClient,  Langfuse } from 'langfuse';
import type { z } from 'zod';

// Core Types for Agent Tools
export interface AgentTool<TParams = unknown, TResult = unknown> {
  name: string;
  description: string;
  parameters: z.ZodType<TParams>;
  execute: (args: TParams, context: ToolContext) => Promise<TResult>;
}

// Runtime Context Types
export interface ToolContext {
  userId?: string;
  dataStream?: any;
  logging?: LoggingContext;
  metadata?: Record<string, unknown>;
}

export interface LoggingContext {
  logger?: Logger;
  langfuse?: Langfuse;
  trace?: LangfuseTraceClient;
}

export interface Logger {
  debug: (message: string, meta?: Record<string, unknown>) => void;
  info: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  error: (message: string, meta?: Record<string, unknown>) => void;
}

// Agent Configuration
export interface AgentConfig {
  name: string;
  model: any; // Your LLM model reference
  systemPrompt: string;
  tools: Record<string, AgentTool>;
  
  // Optional configurations
  maxSteps?: number;
  temperature?: number;
  maxTokens?: number;
  requireStructuredOutput?: boolean;
}

// Runtime Options
export interface AgentRuntimeOptions {
  messages: AgentMessage[];
  streamCallbacks?: Partial<AIStreamCallbacksAndOptions>;
  context?: ToolContext;
}

export interface AgentMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  id?: string;
  name?: string;
}

// Event Types for Streaming
export type AgentEvent = 
  | { type: 'tool-start'; content: { name: string; args: unknown } }
  | { type: 'tool-end'; content: { name: string; result: unknown } }
  | { type: 'step-complete'; content: { text: string; tokens: number } }
  | { type: 'agent-complete'; content: { reason: string; output?: unknown } }
  | { type: 'error'; content: { message: string; error?: unknown } };

// Agent Interface
export interface Agent {
  config: AgentConfig;
  run: (options: AgentRuntimeOptions) => Promise<void>;
} 