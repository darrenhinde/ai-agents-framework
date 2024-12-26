// For this script we need to run on node run time. 
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { LangfuseExporter } from "langfuse-vercel";

const sdk = new NodeSDK({
    traceExporter: new LangfuseExporter(),
    instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

async function main() {
    const result = await generateText({
      model: openai("gpt-4o"),
      maxTokens: 50,
      prompt: "Invent a new holiday and describe its traditions.",
      experimental_telemetry: {
        isEnabled: true,
        functionId: "my-awesome-function",
        metadata: {
          something: "custom",
          someOtherThing: "other-value",
        },
      },
    });
   
    console.log(result.text);
    await sdk.shutdown(); // Flushes the trace to Langfuse
  }

main();