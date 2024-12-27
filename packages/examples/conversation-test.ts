import { Langfuse } from 'langfuse';
import { createAgent } from '../core/agents/agent.config.js';
import { getModel } from '../core/model-providers/index.js';
import { config } from 'dotenv';
import { formatResponse, setDebugOptions } from '../core/agents/utils.js';
import { tool } from 'ai';
import { z } from 'zod';
import type { AgentMessage, AgentResponse } from '../core/agents/types';

// Load environment variables
config();

// Enable debug logging
setDebugOptions({
  enabled: true,
  level: 'debug',
  logToolCalls: true,
  logTraces: true,
  logResponses: true
});

// System Prompt
const CONVERSATION_AGENT_PROMPT = `You are a helpful assistant that remembers previous conversations and can use tools.
When asked about the weather, use the weather tool to get current conditions.
When asked about previous weather reports, refer to your conversation history.
Always be friendly and acknowledge previous interactions.`;

// Tool Definition
function createWeatherTool() {
  return tool({
    description: 'Get the weather for a location',
    parameters: z.object({
      location: z.string().describe('The location to get weather for'),
    }),
    execute: async ({ location }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = {
        location,
        temperature: Math.round(Math.random() * 30),
        conditions: ['sunny', 'rainy', 'cloudy'][Math.floor(Math.random() * 3)]
      };
      console.log(`Weather tool result for ${location}:`, JSON.stringify(result, null, 2));
      return result;
    }
  });
}

async function testConversation() {
  console.log('\\n🧪 Testing conversation with history...');
  
  const langfuse = new Langfuse({
    publicKey: process.env.LANGFUSE_PUBLIC_KEY || '',
    secretKey: process.env.LANGFUSE_SECRET_KEY || '',
    baseUrl: process.env.LANGFUSE_BASE_URL || 'https://cloud.langfuse.com'
  });

  const agent = createAgent({
    name: 'conversation-agent',
    langfuse,
    createNewTrace: true,
    metadata: {
      environment: 'test',
      version: '1.0.0'
    }
  });

  // Keep track of conversation history
  const messages: AgentMessage[] = [
    { role: 'system', content: CONVERSATION_AGENT_PROMPT }
  ];

  try {
    // First message - Ask about weather in San Francisco
    console.log('\\n📤 First message: Asking about San Francisco weather...');
    const result1 = await agent({
      model: getModel('openai:gpt-4o-mini'),
      systemPrompt: CONVERSATION_AGENT_PROMPT,
      tools: {
        getWeather: createWeatherTool()
      },
      maxSteps: 2,
      messages
    }, "What's the weather like in San Francisco?") as AgentResponse;

    console.log('📥 Agent response:', formatResponse(result1));
    
    // Add the interaction to history
    if (result1.messages?.[0]?.content?.[0]?.text) {
      messages.push(
        { role: 'user', content: "What's the weather like in San Francisco?" },
        { role: 'assistant', content: result1.messages[0].content[0].text }
      );
    }

    // Second message - Ask about London weather
    console.log('\\n📤 Second message: Asking about London weather...');
    const result2 = await agent({
      model: getModel('openai:gpt-4o-mini'),
      systemPrompt: CONVERSATION_AGENT_PROMPT,
      tools: {
        getWeather: createWeatherTool()
      },
      maxSteps: 2,
      messages
    }, "How about in London?") as AgentResponse;

    console.log('📥 Agent response:', formatResponse(result2));
    
    // Add the interaction to history
    if (result2.messages?.[0]?.content?.[0]?.text) {
      messages.push(
        { role: 'user', content: "How about in London?" },
        { role: 'assistant', content: result2.messages[0].content[0].text }
      );
    }

    // Third message - Ask about previous weather reports
    console.log('\\n📤 Third message: Asking about previous weather reports...');
    const result3 = await agent({
      model: getModel('openai:gpt-4o-mini'),
      systemPrompt: CONVERSATION_AGENT_PROMPT,
      tools: {
        getWeather: createWeatherTool()
      },
      maxSteps: 2,
      messages
    }, "Can you compare the weather between San Francisco and London based on what you told me?");

    console.log('📥 Agent response:', formatResponse(result3));

  } catch (error) {
    console.error('❌ Conversation test error:', error instanceof Error ? error.message : String(error));
  }
}

async function main() {
  console.log('🚀 Starting conversation test...');
  await testConversation();
  console.log('\\n✅ Test completed');
}

// Run test
main().catch(console.error); 