import { NextRequest } from 'next/server';
import { Langfuse } from 'langfuse';
import { createAgent } from '../core/agents/base-agent';
import { createLogger } from '../core/agents/utils';
import { getWeatherTool } from './tools/weather';
import { searchDocsTool } from './tools/docs';

// Initialize Langfuse (if using)
const langfuse = process.env.LANGFUSE_PUBLIC_KEY ? new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  baseUrl: process.env.LANGFUSE_BASE_URL
}) : undefined;

// Create a logger that sends to your logging service
const logger = createLogger({
  send: async (level, msg, meta) => {
    // Example: Send to your logging service
    await fetch('https://your-logging-service.com/log', {
      method: 'POST',
      body: JSON.stringify({ level, msg, meta })
    }).catch(console.error); // Non-blocking
  }
});

// Create the agent with its core configuration
const agent = createAgent({
  name: 'support-agent',
  model: 'gpt-4-turbo-preview', // Your model reference
  systemPrompt: `You are a helpful support agent that can answer questions and perform tasks.
You have access to weather information and documentation search.
Always be polite and professional.`,
  tools: {
    getWeather: getWeatherTool,
    searchDocs: searchDocsTool
  },
  maxSteps: 5,
  temperature: 0.7
});

export async function POST(req: NextRequest) {
  const { messages, userId } = await req.json();

  // Create a new trace for this conversation
  const trace = langfuse?.trace({
    id: `conv_${Date.now()}`,
    userId,
    metadata: { source: 'api' }
  });

  // Create streaming response
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Run the agent with runtime options
  agent.run({
    messages,
    streamCallbacks: {
      stream: stream,
      onStepFinish: async (info) => {
        // Log step completion to Langfuse
        trace?.generation({
          name: 'agent-step',
          startTime: new Date(),
          endTime: new Date(),
          model: 'gpt-4-turbo-preview',
          modelParameters: {
            temperature: 0.7,
            maxTokens: info.tokens
          },
          completion: info.text
        });
      }
    },
    context: {
      userId,
      logging: {
        logger,
        langfuse,
        trace
      },
      metadata: {
        source: 'api',
        timestamp: new Date().toISOString()
      }
    }
  }).catch(error => {
    console.error('Agent error:', error);
    writer.write(encoder.encode(JSON.stringify({
      type: 'error',
      content: { message: error.message }
    })));
  });

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// Helper for encoding messages
const encoder = new TextEncoder(); 