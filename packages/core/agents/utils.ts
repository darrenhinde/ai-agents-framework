import type { AgentResponse, DebugOptions } from './types';
import { defaultDebugOptions } from './types';

// Response formatting utilities
export function formatResponse(response: unknown): string {
  if (!response || typeof response !== 'object') return 'No response received';
  
  const agentResponse = response as AgentResponse;
  
  // Extract the actual text content and tool results from messages
  const messages = agentResponse.messages || [];
  const output: string[] = [];
  
  for (const msg of messages) {
    if (msg.role === 'assistant' && msg.content) {
      for (const content of msg.content) {
        if (content.type === 'text' && content.text) {
          output.push(content.text);
        } else if (content.toolResults) {
          output.push(`Tool Results: ${JSON.stringify(content.toolResults, null, 2)}`);
        }
      }
    }
  }

  return output.join('\\n') || 'No text content in response';
}

export function formatStructuredResponse(response: unknown): string {
  if (!response) return 'No response received';
  
  // If response is already a string, return it
  if (typeof response === 'string') {
    try {
      // Try to parse it as JSON in case it's a stringified object
      const parsed = JSON.parse(response);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return response;
    }
  }
  
  // If it's an object, stringify it nicely
  if (typeof response === 'object' && response !== null) {
    return JSON.stringify(response, null, 2);
  }
  
  return String(response);
}

// Debug logging utilities
let debugOptions: DebugOptions = { ...defaultDebugOptions };

export function setDebugOptions(options: Partial<DebugOptions>) {
  debugOptions = { ...debugOptions, ...options };
}

export function debug(message: string, type: keyof DebugOptions = 'enabled') {
  if (!debugOptions.enabled) return;
  if (type !== 'enabled' && !debugOptions[type]) return;

  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${debugOptions.level?.toUpperCase()}]`;
  
  console.log(`${prefix} ${message}`);
}

export function debugObject(label: string, obj: unknown, type: keyof DebugOptions = 'enabled') {
  if (!debugOptions.enabled) return;
  if (type !== 'enabled' && !debugOptions[type]) return;

  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${debugOptions.level?.toUpperCase()}]`;
  
  console.log(`${prefix} ${label}:`);
  console.dir(obj, { depth: null, colors: true });
}