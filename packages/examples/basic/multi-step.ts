// For this script we need to run on node run time. 
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { LangfuseExporter } from "langfuse-vercel";
import * as math from 'mathjs';
import { tool } from "ai";
import { z } from "zod";
import type { LangfuseTraceClient } from "langfuse";



// ********* Agent Configuration *********
const SYSTEM_PROMPT = 
  `You are solving math problems.
Reason step by step.
Use the calculator when necessary.
The calculator can only do simple additions, subtractions, multiplications, and divisions.
When you give the final answer, provide an explanation for how you got it.
Make sure to calculate the answer with the calculator. Break down the problem into smaller steps and use the calculator to calculate the answer for each step. Try to do at least 3 steps.
NEVER assume you can do calculations only use the tools provided to get the answer.
Use the tool to provide the final answer"

`;

const MATH_PROBLEM_PROMPT = 
  'A taxi driver earns $9461 per 1-hour work. ' +
  'If he works 12 hours a day and in 1 hour he uses 14-liters petrol with price $134 for 1-liter. ' +
  'How much money does he earn in one day?' + 
  'Think step by step and calculate each step with the calculator. Make sure to deduct the fuel cost from earnings. Use a tool call for Total earnings, then Total fuel cost, then tool for Profit.';


  // ********* Tool Configuration *********
  export const createCalculateTool = () => 
    tool({
      description: 'A tool for evaluating mathematical expressions...',
      parameters: z.object({ expression: z.string() }),
      execute: async ({ expression }, { toolCallId }) => { 
        console.log("Inside calculate tool", toolCallId, expression);
        const result = math.evaluate(expression);
        return result;
      },
    });

  export const createAnswerTool = () =>
    tool({
      description: 'A tool for providing the final answer with explanation',
      parameters: z.object({ 
        steps: z.array(
          z.object({
            calculation: z.string(),
            reasoning: z.string(),
          }),
        ),
        answer: z.number(),
        explanation: z.string()
      }),
      // No execute function - invoking it will terminate the agent
    });

// ********* Main Function *********
async function main() {
    const sdk = new NodeSDK({
      traceExporter: new LangfuseExporter(),
      instrumentations: [getNodeAutoInstrumentations()],
    });

    sdk.start();

    const tools = {
        calculate: createCalculateTool(), 
        answer: createAnswerTool(),
        }

    const {text, toolCalls, response, toolResults, usage, finishReason } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: MATH_PROBLEM_PROMPT,
      tools: tools,
      system: SYSTEM_PROMPT,
      maxSteps: 3,
      toolChoice: 'auto', // Force the model to end with a tool call
      experimental_telemetry: {
        isEnabled: true,
        functionId: "my-calculate-step-function2",
        metadata: {
          something: "custom",
          someOtherThing: "other-value",
        },
      },
    });
   
   console.log("Final tool calls:", JSON.stringify(toolCalls, null, 2));
    await sdk.shutdown(); // Flushes the trace to Langfuse
    console.log("result.text", text);
    // Extract the final answer from the last tool call
    const finalToolCall = toolCalls[toolCalls.length - 1];
    if (finalToolCall.toolName === 'answer') {
        const finalAnswer = {
            answer: finalToolCall.args.answer,
            explanation: finalToolCall.args.explanation,
            steps: finalToolCall.args.steps
        };
        console.log("Final Answer:", finalAnswer);
    }
  }

main();