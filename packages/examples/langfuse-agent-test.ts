import { Langfuse } from 'langfuse';
import { createAgent } from '../core/agents/agent.config.js';
import { getModel } from '../core/model-providers/index.js';
import { config } from 'dotenv';
import { formatResponse, formatStructuredResponse, setDebugOptions, debug } from '../core/agents/utils.js';
import { tool } from 'ai';
import { z } from 'zod';

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

// System Prompts
const WEATHER_AGENT_PROMPT = `You are a helpful weather assistant. Follow these steps EXACTLY:
1. Use the weather tool ONCE to get current conditions for the requested location
2. Based on the weather data, provide a clear and concise response that includes:
   - Current temperature
   - Weather conditions
   - Umbrella recommendation (if conditions are rainy or cloudy)

DO NOT call the weather tool multiple times for the same location.
Always use the actual data from the weather tool in your response.`;

const STRUCTURED_WEATHER_AGENT_PROMPT = `You are a weather analysis agent. Follow these steps EXACTLY in order:
1. First, use the weather tool ONCE to get current conditions for the location
2. Then, use the weatherAnalysis tool to provide your FINAL response with these exact fields:
   - temperature: copy the exact temperature from the weather data
   - conditions: copy the exact conditions from the weather data
   - recommendation: set to true if conditions are rainy or cloudy, false if sunny
   - advice: provide a short weather-appropriate recommendation

The weatherAnalysis tool call MUST be your final action.
Your final response will be the structured output from the weatherAnalysis tool.
Do not add any additional text or explanation.`;

// Tool Definitions
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
      debug(`Weather tool result for ${location}:`, 'logToolCalls');
      debug(JSON.stringify(result, null, 2), 'logToolCalls');
      return result;
    }
  });
}

function createWeatherAnalysisTool() {
  return tool({
    description: 'Provide a structured analysis of weather data',
    parameters: z.object({
      temperature: z.number().describe('The current temperature'),
      conditions: z.string().describe('The current weather conditions'),
      recommendation: z.boolean().describe('Whether to bring an umbrella'),
      advice: z.string().describe('Weather-appropriate recommendation')
    }),
    execute: async (args) => {
      debug('Weather analysis tool result:', 'logToolCalls');
      debug(JSON.stringify(args, null, 2), 'logToolCalls');
      return args;
    }
  });
}

function createUnreliableTool() {
  return tool({
    description: 'A tool that might fail',
    parameters: z.object({
      shouldFail: z.boolean().describe('Whether the tool should fail'),
    }),
    execute: async ({ shouldFail }) => {
      debug(`Unreliable tool called with shouldFail: ${shouldFail}`, 'logToolCalls');
      if (shouldFail) {
        throw new Error('Tool failed as requested');
      }
      return { success: true };
    }
  });
}

// Test Functions
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
      systemPrompt: WEATHER_AGENT_PROMPT,
      tools: {
        getWeather: createWeatherTool()
      },
      maxSteps: 2
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
      systemPrompt: WEATHER_AGENT_PROMPT,
      tools: {
        getWeather: createWeatherTool()
      },
      maxSteps: 2
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
      maxSteps: 2
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
      systemPrompt: STRUCTURED_WEATHER_AGENT_PROMPT,
      tools: {
        getWeather: createWeatherTool(),
        weatherAnalysis: createWeatherAnalysisTool()
      },
      maxSteps: 2,
      requireStructuredOutput: true
    }, 'Analyze the weather in Seattle');

    console.log('📥 Structured output response:', formatStructuredResponse(result));
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
      systemPrompt: WEATHER_AGENT_PROMPT,
      tools: {
        getWeather: createWeatherTool()
      },
      maxSteps: 2
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