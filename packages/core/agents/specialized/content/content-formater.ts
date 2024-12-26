// We want to make the content creator

//imports
import { generateText } from 'ai';
import { v4 as uuidv4 } from 'uuid';
import { getModel } from '../../../model-providers/index';
import { ContentResearchTool } from './content-researcher';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { LangfuseExporter } from 'langfuse-vercel';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { Langfuse } from 'langfuse';
import { randomUUID } from 'node:crypto';



// Prompt
const contentCreatorPrompt = `You are an expert at creating engaging and exciting 
LinkedIn posts that encourage people's feedback. Your task is to create an excellent
 LinkedIn post based on the given topic. Follow these instructions carefully:

1. Read the following topic for your LinkedIn post:
<topic>
{{TOPIC}}
</topic>

If you need to do research, use the research tool, and then use the results to create the post.
When to use the research tool:
- When you need to do research on the topic
- The topic is not clear or not well defined or is asking for research to be done. 

When not to use the research tool:
- When you have enough information to create the post
- When the topic is clear and well defined and you do not need to do research
- Research has already been done and you have the information

2. Create an engaging LinkedIn post following these guidelines:

a) Start with a captivating opening line:
   - Identify a "relatable enemy" that your audience might resonate with
   - Use a negative word or phrase to express sentiment towards this enemy
   - Format: The {RelatableEnemy} is {Negativity}

b) Introduce the hero:
   - Flip the narrative by introducing the opposite of the enemy
   - Highlight the strengths or positive momentum of the hero
   - Format: The {Hero} is {StrongPositiveStatement}

c) Add gasoline and a teaser:
   - Express your excitement or passion for the change or development
   - Follow with a teaser question to make readers want to click "see more"
   - Format: {Gasoline}. {TeaserQuestion}?

3. Format your post as follows:
   - Each sentence should be on a new line
   - In each paragraph, when a new sentence is made, it should be longer than the first one
   - Follow this pattern:
     {short sentence}
     {slightly bigger sentence}
     {The longest in the paragraph sentence}

     {The longest in the paragraph sentence}
     {slightly bigger sentence}
     {short sentence}

     {short sentence}
     {slightly bigger sentence}
     {The longest in the paragraph sentence}

4. Use the following voice, tone, and style:
   - Warm, inclusive, and accessible language
   - Conversational writing, as if speaking directly to the audience
   - Contractions and friendly expressions
   - Avoid technical jargon; explain complex concepts simply
   - Supportive, encouraging, and empowering tone
   - Optimistic, reinforcing the audience's ability to succeed
   - Emphasize progress and growth
   - Frame challenges as opportunities
   - Write naturally and casually
   - Use conversational markers (e.g., "Let's dive in," "Here's the deal")
   - Reinforce key ideas through repetition
   - Break down complex ideas into simple, relatable concepts

5. Structure your post as follows:
   - Start with a welcoming introduction
   - Organize content into clear segments
   - Use numbered lists or headers to guide the audience
   - Conclude with an empowering message and call to action

6. Incorporate these additional techniques:
   - Inject personality by sharing brief personal insights
   - Engage the audience directly with rhetorical questions or prompts
   - Focus on benefits, not just features
   - Mention ongoing updates or improvements to show adaptability

7. Write your LinkedIn post as final output. Do not use emoticons or emojis in your post unless its direcly explicit by the user.


Make use of these symbols when doing bullet points or when to seperate sections:
☑
↳ 

Remember to tailor the content to the given topic while following all the guidelines provided above.
If you need to do research, use the research tool.
Remember final output should be the final LinkedIn post following the format provided above. 
`;

// Tools

// Agent
// ********* Main Function *********
export async function ContentCreator(modelName: string, userPrompt: string) {

    const sdk = new NodeSDK({
        traceExporter: new LangfuseExporter(),
        instrumentations: [getNodeAutoInstrumentations()],
    });

    sdk.start();

    const langfuse = new Langfuse();
    const parentTraceId = randomUUID();
        
  const model = getModel(modelName);
  const traceId = uuidv4();

  // Create a trace with more metadata
  const trace = langfuse.trace({
    name: `Content Creator - ${modelName}`,
    userId: 'test-user', // Optional: Add if you want to track per user
    id: traceId,
    input: {
      systemPrompt: contentCreatorPrompt,
      userPrompt: userPrompt,
    },
    metadata: {
      modelName,
      problemType: 'content-creator',
      environment: process.env.NODE_ENV,
    },
    tags: ['content-creator', modelName],
  });
  const traceUrl = trace.getTraceUrl();

  // Create a span for the generateText operation
  const span = trace.span({
    name: 'generate-text',
    id: traceId,
    input: {
      systemPrompt: contentCreatorPrompt,
      userPrompt: userPrompt,
    },
  });
  const tools = {
    researchTool: ContentResearchTool(traceId, trace, modelName),
  };

  const {
    response,
    toolCalls,
    text: answer,
  } = await generateText({
    model,
    tools,
    toolChoice: 'auto',
    maxSteps: 3,
    system: contentCreatorPrompt,
    prompt: userPrompt,
    experimental_telemetry: {
      isEnabled: true,
      functionId: `content-creator-${model}`,
      metadata: {
        traceId: traceId,
        parentTraceId: parentTraceId,
        langfuseTraceId: parentTraceId,
        langfuseUpdateParent: false, // Do not update the parent trace with execution results
        traceUrl: traceUrl,
        spanId: span.id, // Add the span ID
        modelId: model.modelId,
      },
    },
  });

  trace.span({
    name: 'Final Answer',
    id: traceId,
    input: {
      Input: userPrompt,
    },
    output: {
      answer,
      toolCalls,
    },
    statusMessage: 'Success',
  });
  // // Log tool calls as separate spans
  // for (const toolCall of toolCalls) {
  //   trace.generation({
  //     name: `tool-call-${toolCall.toolName}`,
  //     model: modelName,
  //     modelParameters: {
  //       tool: toolCall.toolName,
  //     },
  //     input: toolCall.args,
  //     output: toolCall.args,
  //   });
  // }

  // End the span with the final result
  console.log('Content Creator Output: ', answer);
  span.end({
    output: {
      id: traceId,
      answer,
      toolCalls,
    },
  });
  trace.update({
    output: {
      answer,
      toolCalls,
    },
  });

  // Make sure to flush before returning
  await langfuse.flushAsync();
  await sdk.shutdown();
  return response;
}
