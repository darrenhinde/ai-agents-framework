import { Langfuse } from 'langfuse';
import { createAgent } from '../core/agents/agent.config.js';
import { getModel } from '../core/model-providers/index.js';
import { tool } from 'ai';
import { z } from 'zod';
import { config } from 'dotenv';

// Load environment variables
config();

interface MessageContent {
  type: string;
  text?: string;
  toolCallId?: string;
  toolName?: string;
  args?: Record<string, unknown>;
  toolResults?: unknown;
}

interface Message {
  role: string;
  content: MessageContent[];
}

interface AgentResponse {
  messages?: Message[];
  toolResults?: Record<string, unknown>;
  structuredOutput?: unknown;
  [key: string]: unknown;
}

// Helper to format responses
function formatResponse(response: unknown): string {
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

// Example tool that simulates an API call
const createWeatherTool = () => tool({
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
    console.log('Weather tool result:', result);
    return result;
  }
});

// Example tool that might fail
const createUnreliableTool = () => tool({
  description: 'A tool that might fail',
  parameters: z.object({
    shouldFail: z.boolean().describe('Whether the tool should fail'),
  }),
  execute: async ({ shouldFail }) => {
    console.log('Unreliable tool called with shouldFail:', shouldFail);
    if (shouldFail) {
      throw new Error('Tool failed as requested');
    }
    return { success: true };
  }
});

// Add a structured output tool for weather analysis
const createWeatherAnalysisTool = () => tool({
  description: 'Provide a structured analysis of weather data',
  parameters: z.object({
    temperature: z.number().describe('The current temperature'),
    conditions: z.string().describe('The current weather conditions'),
    recommendation: z.boolean().describe('Whether to bring an umbrella'),
    advice: z.string().describe('Weather-appropriate recommendation')
  }),
  execute: async (args) => args // Just return the structured data
});

async function testNormalAgent() {
  console.log('\\n🧪 Testing normal agent...');
  
  const langfuse = new Langfuse({
    publicKey: process.env.LANGFUSE_PUBLIC_KEY || '',
    secretKey: process.env.LANGFUSE_SECRET_KEY || '',
    baseUrl: process.env.LANGFUSE_BASE_URL || 'https://cloud.langfuse.com'
  });

  const agent = createAgent({
    name: 'weather-agent',
    langfuse,
    createNewTrace: true,
    metadata: {
      environment: 'test',
      version: '1.0.0'
    }
  });

  try {
    console.log('📤 Sending request to agent...');
    const result = await agent({
      model: getModel('openai:gpt-4o-mini'),
      systemPrompt: `You are a helpful weather assistant. Follow these steps EXACTLY:
1. Use the weather tool ONCE to get current conditions for the requested location
2. Based on the weather data, provide a clear and concise response that includes:
   - Current temperature
   - Weather conditions
   - Umbrella recommendation (if conditions are rainy or cloudy)

DO NOT call the weather tool multiple times for the same location.
Always use the actual data from the weather tool in your response.`,
      tools: {
        getWeather: createWeatherTool()
      },
      maxSteps: 2 // Limit to 2 steps: 1 for tool call, 1 for response
    }, 'What\'s the weather like in San Francisco and should I bring an umbrella?');

    console.log('📥 Agent response:', formatResponse(result));
  } catch (error) {
    console.error('❌ Normal agent error:', error instanceof Error ? error.message : String(error));
  }
}

async function testServerlessAgent() {
  console.log('\\n🧪 Testing serverless agent...');
  
  const langfuse = new Langfuse({
    publicKey: process.env.LANGFUSE_PUBLIC_KEY || '',
    secretKey: process.env.LANGFUSE_SECRET_KEY || '',
    baseUrl: process.env.LANGFUSE_BASE_URL || 'https://cloud.langfuse.com'
  });

  const agent = createAgent({
    name: 'serverless-weather-agent',
    langfuse,
    createNewTrace: true,
    isServerless: true,
    metadata: {
      environment: 'test-serverless',
      version: '1.0.0'
    }
  });

  try {
    // Test successful case
    console.log('📤 Testing successful case...');
    const result1 = await agent({
      model: getModel('openai:gpt-4o-mini'),
      systemPrompt: `You are a helpful weather assistant. Follow these steps for each request:
1. Use the weather tool to get current conditions for the requested location
2. After receiving the weather data, provide a natural language response that includes:
   - Current temperature
   - Weather conditions
   - Any relevant weather advice

Make sure to reference the actual data from the weather tool in your response and speak in a friendly, conversational tone.`,
      tools: {
        getWeather: createWeatherTool()
      },
      maxSteps: 3
    }, 'What\'s the weather like in London?');

    console.log('📥 Serverless agent success response:', formatResponse(result1));

    // Test error case
    console.log('\\n📤 Testing error case...');
    const result2 = await agent({
      model: getModel('openai:gpt-4o-mini'),
      systemPrompt: 'Test the unreliable tool with shouldFail=true.',
      tools: {
        unreliable: createUnreliableTool()
      },
      maxSteps: 3
    }, 'Test the tool with shouldFail set to true');

    console.log('📥 Serverless agent error case response:', formatResponse(result2));
  } catch (error) {
    console.error('❌ Serverless agent error:', error instanceof Error ? error.message : String(error));
  }
}

async function testStructuredOutput() {
  console.log('\\n🧪 Testing structured output mode...');
  
  const langfuse = new Langfuse({
    publicKey: process.env.LANGFUSE_PUBLIC_KEY || '',
    secretKey: process.env.LANGFUSE_SECRET_KEY || '',
    baseUrl: process.env.LANGFUSE_BASE_URL || 'https://cloud.langfuse.com'
  });

  const agent = createAgent({
    name: 'structured-weather-agent',
    langfuse,
    createNewTrace: true,
    metadata: {
      environment: 'test-structured',
      version: '1.0.0'
    }
  });

  try {
    console.log('📤 Testing structured output...');
    const result = await agent({
      model: getModel('openai:gpt-4o-mini'),
      systemPrompt: `You are a weather analysis agent. Follow these steps EXACTLY:
1. Use the weather tool ONCE to get current conditions for the location
2. Based on the weather data, use the weatherAnalysis tool to provide a structured response with:
   - temperature: the exact temperature from the weather data
   - conditions: the exact conditions from the weather data
   - recommendation: true if conditions are rainy or cloudy, false otherwise
   - advice: a short weather-appropriate recommendation

DO NOT call the weather tool multiple times.
ALWAYS use the weatherAnalysis tool to provide your final response.`,
      tools: {
        getWeather: createWeatherTool(),
        weatherAnalysis: createWeatherAnalysisTool()
      },
      maxSteps: 2, // Limit to 2 steps: 1 for weather tool, 1 for analysis
      requireStructuredOutput: true
    }, 'Analyze the weather in Seattle');

    const response = result as AgentResponse;
    console.log('📥 Structured output response:', 
      JSON.stringify(response.structuredOutput, null, 2));
  } catch (error) {
    console.error('❌ Structured output error:', error instanceof Error ? error.message : String(error));
  }
}

async function testLangfuseFailure() {
  console.log('\\n🧪 Testing agent with invalid Langfuse credentials...');
  
  const langfuse = new Langfuse({
    publicKey: 'invalid-key',
    secretKey: 'invalid-secret',
    baseUrl: 'https://cloud.langfuse.com'
  });

  const agent = createAgent({
    name: 'resilient-agent',
    langfuse,
    createNewTrace: true,
    metadata: {
      environment: 'test-failure',
      version: '1.0.0'
    }
  });

  try {
    console.log('📤 Testing agent resilience...');
    const result = await agent({
      model: getModel('openai:gpt-4o-mini'),
      systemPrompt: 'You are a helpful assistant. Use the weather tool to get information and respond naturally.',
      tools: {
        getWeather: createWeatherTool()
      },
      maxSteps: 3
    }, 'What\'s the weather like in Tokyo?');

    console.log('📥 Agent response (despite Langfuse failure):', formatResponse(result));
  } catch (error) {
    console.error('❌ Unexpected error:', error instanceof Error ? error.message : String(error));
  }
}

async function main() {
  console.log('🚀 Starting agent tests...');
  
  // Test all scenarios
  await testNormalAgent();
  console.log('\\n-------------------');
  
  await testServerlessAgent();
  console.log('\\n-------------------');
  
  await testStructuredOutput();
  console.log('\\n-------------------');
  
  await testLangfuseFailure();
  
  console.log('\\n✅ Tests completed');
}

// Run tests
main().catch(console.error); 