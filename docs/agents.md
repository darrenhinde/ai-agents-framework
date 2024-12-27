# AI Agents Framework Documentation

This guide explains how to create and use agents in the AI Agents Framework. The framework provides a flexible way to create agents that can use tools, maintain conversation history, and optionally track their execution with Langfuse.

## Table of Contents
- [Basic Concepts](#basic-concepts)
- [Creating an Agent](#creating-an-agent)
- [Agent Types](#agent-types)
- [Examples](#examples)
- [Response Formats](#response-formats)
- [Best Practices](#best-practices)

## Basic Concepts

An agent is a wrapper around a language model that can:
- Process messages using a system prompt
- Use tools to gather information or perform actions
- Maintain conversation history
- Track execution with Langfuse (optional)

The framework ensures that:
- Tool execution is properly traced and logged
- Errors are gracefully handled without breaking the application
- Results are cached to avoid duplicate tool calls
- Conversation context is maintained when needed

### Key Components

1. **Agent Configuration**
```typescript
interface AgentConfig {
  name: string;                    // Identifier for the agent
  traceId?: string;               // Optional: Custom trace ID for linking related operations
  langfuse?: Langfuse;            // Optional: Langfuse client for tracing
  createNewTrace?: boolean;        // Optional: Create new trace for each call
  metadata?: Record<string, unknown>; // Optional: Additional context for tracing
  isServerless?: boolean;         // Optional: Flag for serverless environments
  parentTraceId?: string;         // Optional: Link to parent trace
}
```

2. **Agent Options**
```typescript
interface AgentOptions {
  systemPrompt: string;           // Instructions for the agent
  model: LanguageModelV1;         // Language model to use
  tools?: Record<string, CoreTool>; // Available tools
  maxSteps?: number;              // Max steps for tool usage (default: 3)
  messages?: AgentMessage[];      // Conversation history
  requireStructuredOutput?: boolean; // Force structured output
}
```

## Creating an Agent

Here's a practical example of creating an agent with proper configuration:

```typescript
import { createAgent } from '@ai-agents/core';
import { getModel } from '@ai-agents/core/model-providers';
import { Langfuse } from 'langfuse';

// Create a Langfuse client (optional)
const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  baseUrl: process.env.LANGFUSE_BASE_URL // Optional: for self-hosted
});

// Create the agent with tracing
const agent = createAgent({
  name: 'my-agent',
  langfuse,
  createNewTrace: true, // New trace for each interaction
  metadata: {
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  },
  isServerless: true // Important for proper trace flushing
});

// Define a meaningful system prompt
const SYSTEM_PROMPT = `You are a helpful assistant that:
1. Uses available tools to gather information
2. Provides clear and concise responses
3. Maintains context across conversations
4. Handles errors gracefully`;

// Use the agent with proper configuration
const result = await agent({
  model: getModel('openai:gpt-4o-mini'),
  systemPrompt: SYSTEM_PROMPT,
  maxSteps: 3,
  tools: {
    // At least one tool should be provided for the agent to be useful
    search: searchTool,
    analyze: analysisTool
  }
}, "Can you help me find and analyze recent market trends?");
```

## Agent Types

### Basic Agent with Tools
A basic agent that can use tools to gather information:

```typescript
import { tool } from 'ai';
import { z } from 'zod';

// Define a useful search tool
const searchTool = tool({
  name: 'search',
  description: 'Search for information in a database',
  parameters: z.object({
    query: z.string().describe('The search query'),
    filters: z.object({
      date: z.string().optional(),
      category: z.string().optional()
    }).optional()
  }),
  execute: async ({ query, filters }) => {
    // Implement actual search logic
    const results = await searchDatabase(query, filters);
    return results;
  }
});

const agent = createAgent({ 
  name: 'search-agent',
  langfuse 
});

const result = await agent({
  model: getModel('openai:gpt-4o-mini'),
  systemPrompt: 'You are a search assistant that helps find relevant information.',
  tools: {
    search: searchTool
  },
  maxSteps: 2
}, "Find recent articles about AI");
```

### Conversation Agent with Memory
An agent that maintains conversation history and context:

```typescript
// Initialize conversation history
const messages = [
  { 
    role: 'system', 
    content: 'You are an assistant that remembers context and uses tools effectively.' 
  }
];

// First interaction
const result1 = await agent({
  model: getModel('openai:gpt-4o-mini'),
  systemPrompt: 'You are a helpful assistant that maintains context.',
  tools: {
    search: searchTool,
    analyze: analysisTool
  },
  messages,
  maxSteps: 3
}, "What were the top tech trends in 2023?");

// Add the interaction to history
messages.push(
  { role: 'user', content: "What were the top tech trends in 2023?" },
  { role: 'assistant', content: result1.messages[0].content[0].text }
);

// Continue conversation with context
const result2 = await agent({
  model: getModel('openai:gpt-4o-mini'),
  systemPrompt: 'You are a helpful assistant that maintains context.',
  tools: {
    search: searchTool,
    analyze: analysisTool
  },
  messages,
  maxSteps: 3
}, "How do these compare to 2022?");
```

### Structured Output Agent
An agent that returns data in a specific format:

```typescript
// Define analysis tool with clear output structure
const analysisTool = tool({
  name: 'analyze',
  description: 'Analyze data and return structured insights. The output will be used as the final response.',
  parameters: z.object({
    data: z.array(z.unknown()),
    metrics: z.array(z.string())
  }),
  execute: async ({ data, metrics }) => {
    const analysis = await analyzeData(data, metrics);
    return {
      summary: analysis.summary,
      trends: analysis.trends,
      recommendations: analysis.recommendations
    };
  }
});

// Define clear output expectations in the system prompt
const ANALYSIS_PROMPT = `You are a data analysis assistant that provides structured insights.
Follow these steps precisely:
1. Use the search tool to gather relevant data
2. Use the analyze tool to process the data
3. Ensure the final output matches this exact structure:
   {
     "summary": "Brief overview of findings",
     "trends": [
       {
         "metric": "metric name",
         "change": numeric value,
         "insight": "explanation"
       }
     ],
     "recommendations": ["action item 1", "action item 2"]
   }
4. Do not include any additional text or explanations
5. Use all available steps if needed to gather complete data`;

const result = await agent({
  model: getModel('openai:gpt-4o-mini'),
  systemPrompt: ANALYSIS_PROMPT,
  tools: {
    search: searchTool,
    analyze: analysisTool
  },
  requireStructuredOutput: true,
  maxSteps: 3  // Agent will likely use all steps when structure is required
}, "Analyze user engagement metrics for Q4 2023");

// Result will be structured exactly as specified in the prompt
```

## Working with Structured Outputs

### Understanding Agent Behavior

1. **Step Usage**
   - When `requireStructuredOutput` is true, the agent tends to use all available steps
   - This happens because the agent needs to:
     * Gather raw data (usually step 1)
     * Process or transform data (usually step 2)
     * Format final output (usually step 3)

2. **Prompt Design**
   ```typescript
   const STRUCTURED_PROMPT = `You are a data processing assistant.
   Important Instructions:
   1. ALWAYS follow this exact process:
      - First step: Gather raw data using search
      - Second step: Process data using analyze
      - Final step: Format output using specified structure
   2. NEVER skip steps even if you think you have enough data
   3. ALWAYS validate data structure before returning
   4. If data is incomplete, use remaining steps to fill gaps
   5. Output must match this JSON structure exactly:
      {
        "field1": "value1",
        "field2": ["item1", "item2"],
        "field3": {
          "subfield1": "value",
          "subfield2": number
        }
      }`;
   ```

3. **Tool Design for Structured Output**
   ```typescript
   const formattingTool = tool({
     name: 'formatOutput',
     description: 'Format data according to required structure. Use this as the final step.',
     parameters: z.object({
       data: z.unknown(),
       schema: z.string().describe('The expected output schema')
     }),
     execute: async ({ data, schema }) => {
       // Validate and format data according to schema
       return validateAndFormat(data, schema);
     }
   });
   ```

### Best Practices for Structured Outputs

1. **Clear Structure Definition**
   ```typescript
   // Define expected structure using Zod
   const OutputSchema = z.object({
     summary: z.string(),
     metrics: z.array(z.object({
       name: z.string(),
       value: z.number(),
       trend: z.enum(['up', 'down', 'stable'])
     })),
     recommendations: z.array(z.string())
   });

   // Use in tool definition
   const outputTool = tool({
     name: 'formatOutput',
     description: 'Format final output according to schema',
     parameters: z.object({
       data: z.unknown(),
     }),
     execute: async ({ data }) => {
       return OutputSchema.parse(data);
     }
   });
   ```

2. **Handling Partial Data**
   ```typescript
   const PARTIAL_DATA_PROMPT = `When handling incomplete data:
   1. Use remaining steps to fill missing fields
   2. For unavailable data:
      - Numbers: Use null or 0 depending on context
      - Strings: Use "Not available"
      - Arrays: Include placeholder with explanation
   3. Always include metadata about data completeness
   4. Never skip required fields in the structure`;
   ```

3. **Validation Steps**
   ```typescript
   const validateTool = tool({
     name: 'validateOutput',
     description: 'Validate output structure before returning',
     parameters: z.object({
       data: z.unknown(),
       requiredFields: z.array(z.string())
     }),
     execute: async ({ data, requiredFields }) => {
       const validation = validateStructure(data, requiredFields);
       if (!validation.isValid) {
         throw new Error(`Invalid structure: ${validation.errors.join(', ')}`);
       }
       return data;
     }
   });
   ```

### Common Patterns

1. **Multi-Step Data Processing**
   ```typescript
   const result = await agent({
     systemPrompt: STRUCTURED_PROMPT,
     tools: {
       gather: gatherDataTool,
       process: processDataTool,
       validate: validateTool,
       format: formatOutputTool
     },
     requireStructuredOutput: true,
     maxSteps: 4  // Allow enough steps for complete processing
   }, "Generate structured report");
   ```

2. **Error Recovery**
   ```typescript
   try {
     const result = await agent({
       systemPrompt: STRUCTURED_PROMPT,
       tools: structuredTools,
       requireStructuredOutput: true,
       maxSteps: 3,
       errorHandler: async (error, partialData) => {
         // Attempt to salvage partial data
         return await formatPartialOutput(partialData);
       }
     }, query);
   } catch (error) {
     // Handle structural validation errors
     console.error('Structure validation failed:', error);
     return fallbackStructure;
   }
   ```

3. **Chained Structured Outputs**
   ```typescript
   // First agent produces structured data
   const rawData = await dataAgent({
     systemPrompt: DATA_COLLECTION_PROMPT,
     requireStructuredOutput: true
   }, "Gather metrics");

   // Second agent processes structured data
   const analysis = await analysisAgent({
     systemPrompt: ANALYSIS_PROMPT,
     requireStructuredOutput: true,
     messages: [
       {
         role: 'system',
         content: 'Process the provided structured data'
       },
       {
         role: 'user',
         content: JSON.stringify(rawData)
       }
     ]
   }, "Analyze metrics");
   ```

## Examples

### Weather Agent with Error Handling
```typescript
import { Langfuse } from 'langfuse';
import { createAgent } from '@ai-agents/core';
import { getModel } from '@ai-agents/core/model-providers';
import { tool } from 'ai';
import { z } from 'zod';

const WEATHER_AGENT_PROMPT = `You are a helpful weather assistant that:
1. Uses the weather tool to get current conditions
2. Provides clear and concise responses
3. Includes umbrella recommendations for rainy/cloudy conditions
4. Handles API errors gracefully
5. Provides helpful alternatives when data is unavailable`;

function createWeatherTool() {
  return tool({
    name: 'getWeather',
    description: 'Get current weather conditions for a location',
    parameters: z.object({
      location: z.string().describe('The location to get weather for'),
      units: z.enum(['celsius', 'fahrenheit']).optional()
    }),
    execute: async ({ location, units = 'celsius' }) => {
      try {
        // Implement actual weather API call
        const result = await weatherAPI.getCurrentConditions(location, units);
        return {
          location,
          temperature: result.temp,
          conditions: result.conditions,
          humidity: result.humidity,
          windSpeed: result.windSpeed,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        // Proper error handling
        console.error(`Weather API error for ${location}:`, error);
        throw new Error(`Unable to get weather for ${location}. Please try again later.`);
      }
    }
  });
}

async function testWeatherAgent() {
  const agent = createAgent({
    name: 'weather-agent',
    langfuse: new Langfuse({
      publicKey: process.env.LANGFUSE_PUBLIC_KEY || '',
      secretKey: process.env.LANGFUSE_SECRET_KEY || ''
    }),
    createNewTrace: true,
    metadata: {
      service: 'weather-service',
      version: '1.0.0'
    }
  });

  try {
    const result = await agent({
      model: getModel('openai:gpt-4o-mini'),
      systemPrompt: WEATHER_AGENT_PROMPT,
      tools: {
        getWeather: createWeatherTool()
      },
      maxSteps: 2
    }, "What's the weather like in San Francisco?");

    console.log('Weather Agent Response:', result);
  } catch (error) {
    console.error('Weather Agent Error:', error);
    // Handle error appropriately
  }
}
```

## Best Practices

1. **System Prompts**
   - Make them specific and actionable
   - Include error handling instructions
   - Define clear steps for the agent to follow

2. **Tool Design**
   - Include proper error handling
   - Cache results when appropriate
   - Provide detailed parameter descriptions
   - Return structured data

3. **Conversation Management**
   - Initialize with system message
   - Maintain relevant context
   - Limit history length for performance

4. **Error Handling**
   - Implement proper try-catch blocks
   - Provide helpful error messages
   - Have fallback behaviors

5. **Tracing**
   - Use meaningful trace names
   - Include relevant metadata
   - Ensure traces are flushed in serverless environments

6. **Performance**
   - Cache tool results
   - Limit conversation history
   - Set appropriate maxSteps
   - Use structured outputs when needed 