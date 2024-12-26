// We want to make the content creator 

//imports
import { generateText, tool } from 'ai';
import type { Langfuse, LangfuseTraceClient } from 'langfuse';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { initLangfuse } from '../../../tracing/langfuse/langfuse-register';
import { getModel } from '../../../model-providers/index';
import { PerplexityTool } from '../../../tools/perplexity/perplexity-tool';

// Prompt 
const contentResearchPrompt = `
You are a research agent tasked with constructing valid search queries and summarizing information for a given topic. Your goal is to provide accurate and relevant information with supporting links.

You will be given a topic in the following format:
<topic>
{{TOPIC}}
</topic>

Follow these steps:

1. Construct a valid search query based on the given topic. The query should be concise yet comprehensive enough to gather relevant information. Write your search query inside <search_query> tags.

2. Use the research tool to search for information using your constructed query. 

3. Once you receive the search results, process the information in one of two ways:
   a) If the information is straightforward and doesn't require extensive explanation, return the results directly to the user.
   b) If the information is complex or requires synthesis, summarize the important points, ensuring to include only the most relevant details.

4. Always include the links provided by the research tool in your response, regardless of whether you're returning the direct results or a summary.

5. Present your findings in the following format:
   <research_results>
   [Your summary or direct results here]
   
   Sources:
   [List of relevant links here]
   </research_results>

Remember to maintain objectivity and accuracy in your summaries, and ensure that all information is properly attributed to its source through the provided links.

If you need to perform multiple searches or refine your query, you may repeat steps 1-2 as necessary. Always use your best judgment to provide the most comprehensive and accurate information possible.

Begin by constructing your search query based on the given topic.


`;

// Tools 


// Agent 
// ********* Main Function *********
export async function ContentResearch(modelName: string, userPrompt: string, parentTraceId?: string , traceObject?: LangfuseTraceClient) {
    const model = getModel(modelName);
    const traceId = parentTraceId || uuidv4();

    let langfuse: Langfuse | undefined;
    const trace = traceObject || (() => {
        langfuse = initLangfuse();
        return langfuse.trace({
            name: `Content Creator - ${modelName}`,
            userId: "test-user", // Optional: Add if you want to track per user
            id: traceId,
            input: {
                systemPrompt: contentResearchPrompt,
                userPrompt: userPrompt
            },
            metadata: {
                modelName,
                problemType: "content-creator", 
                environment: process.env.NODE_ENV
            },
            tags: ["content-creator", modelName]
        });
    })();

    const traceUrl = trace.getTraceUrl();

    // Create a span for the generateText operation
    const span = trace.span({
        name: "research-agent",
        id: traceId,
        input: {
            systemPrompt: contentResearchPrompt,
            userPrompt: userPrompt
        }
    });
    console.log("Research Input: ", userPrompt);
   

    const tools = {
        PerplexityTool: PerplexityTool({ traceId, trace }),    }
  
    const { response, toolCalls, text: answer } = await generateText({
      model,
      tools,
      toolChoice: 'required',
      maxSteps: 1,
      system: contentResearchPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        functionId: `content-creator-${model}`,
        metadata: {
          traceId: traceId,
          parentTraceId: traceId,
          traceUrl: traceUrl,
          spanId: span.id, // Add the span ID
          langfuseTraceId: trace.id,
          modelId: model.modelId,
        },
      },
    });
  
    trace.span({ 
      name: "Final Answer",
      id: traceId,
      input: {
        Input: userPrompt
      },
      output: {
        answer,
        toolCalls,
      },
      statusMessage: "Success",
    });
    // Log tool calls as separate spans
    for (const toolCall of toolCalls) {
      trace.generation({
        name: `tool-call-${toolCall.toolName}`,
        model: modelName,
        modelParameters: {
          tool: toolCall.toolName,
        },
        input: toolCall.args,
        output: toolCall.args,
      });
    }
    console.log("Research Output: ", answer);
  
    // End the span with the final result
    span.end({
      output: {
        id: traceId,
        answer,
        toolCalls
      }
    });
    trace.update({
      output: {
        answer,
        toolCalls
      }
    });
  
    // Make sure to flush before returning
    if (!traceObject && langfuse) {
      await langfuse.flushAsync();
    }
    
    return response;
  }


  // Make a tool of the research agent
 export const ContentResearchTool = (traceId: string, trace: LangfuseTraceClient , modelName: string) => tool({
    description: 'Research agent',
    parameters: z.object({
      prompt: z.string().describe('The prompt to send to the research agent on what to research, give the objective of the research and the main points to be covered.'),
    }),
    execute: async ({ prompt }) => {
        trace.span({
            name: "research-tool",
            id: traceId,
            input: { prompt },
          });
      return ContentResearch(modelName, prompt, traceId, trace);
    },
  });