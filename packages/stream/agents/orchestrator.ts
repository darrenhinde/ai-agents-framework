import { routerAgent } from "./router-agent";
import { strategyAgent } from "./strategy-agent";
import { researchAgent } from "./research-agent";
import { formatterAgent } from "./formatter-agent";
import { publisherAgent } from "./publisher-agent";
import type { Message } from "ai";

interface ToolResult {
  toolName: string;
  result: any;
  toolCallId: string;
  isError?: boolean;
}

export interface OrchestrationResult {
  action: string;
  platform: string;
  references?: any;
  strategy?: any;
  formattedContent?: any;
  publishedContent?: any;
}

/**
 * Orchestrates the content management workflow using multiple specialized agents
 *
 * @param userInput The user's request or message
 * @returns A structured result containing the outputs from various agents
 */
export async function orchestrateAgents(
  userInput: string
): Promise<OrchestrationResult> {
  try {
    // 1. Route the request
    console.log("\n🔄 Running Router Agent...");
    const routerResult = await routerAgent([
      { role: "user", content: userInput, id: "1" },
    ]);

    // Log streaming text
    console.log("\nRouter Agent Response:");
    for await (const chunk of routerResult.textStream) {
      process.stdout.write(chunk);
    }

    // Wait for tool results
    console.log("\n\nRouter Tool Results:");
    const routerToolResults: ToolResult[] = await routerResult.toolResults;
    console.log(JSON.stringify(routerToolResults, null, 2));

    const route = routerToolResults?.[0]?.result || {
      action: "create_content",
      platform: "blog",
    };
    console.log("\nSelected Route:", route);

    // Initialize result object
    const result: OrchestrationResult = {
      action: route.action,
      platform: route.platform,
    };

    // 2. Handle different action paths
    switch (route.action) {
      case "create_content": {
        try {
          // a. Research phase
          console.log("\n📚 Running Research Agent...");
          const researchResult = await researchAgent([
            {
              role: "user",
              content: `Research this topic: ${userInput}`,
              id: "2",
            },
          ]);

          console.log("\nResearch Agent Response:");
          for await (const chunk of researchResult.textStream) {
            process.stdout.write(chunk);
          }

          const researchToolResults: ToolResult[] =
            await researchResult.toolResults;
          console.log("\n\nResearch Tool Results:");
          console.log(JSON.stringify(researchToolResults, null, 2));
          result.references = researchToolResults?.[0]?.result;

          // b. Strategy phase
          console.log("\n🎯 Running Strategy Agent...");
          const strategyResult = await strategyAgent([
            {
              role: "user",
              content: `Create a strategy for ${route.platform} about: ${userInput}`,
              id: "3",
            },
          ]);

          console.log("\nStrategy Agent Response:");
          for await (const chunk of strategyResult.textStream) {
            process.stdout.write(chunk);
          }

          const strategyToolResults: ToolResult[] =
            await strategyResult.toolResults;
          console.log("\n\nStrategy Tool Results:");
          console.log(JSON.stringify(strategyToolResults, null, 2));
          result.strategy = strategyToolResults?.[0]?.result;

          // c. Formatting phase
          console.log("\n✨ Running Formatter Agent...");
          const formatterResult = await formatterAgent([
            {
              role: "user",
              content: JSON.stringify({
                content: userInput,
                platform: route.platform,
                tone: result.strategy?.tone || "professional",
              }),
              id: "4",
            },
          ]);

          console.log("\nFormatter Agent Response:");
          for await (const chunk of formatterResult.textStream) {
            process.stdout.write(chunk);
          }

          const formatterToolResults: ToolResult[] =
            await formatterResult.toolResults;
          console.log("\n\nFormatter Tool Results:");
          console.log(JSON.stringify(formatterToolResults, null, 2));
          result.formattedContent = formatterToolResults?.[0]?.result;

          // d. Publishing phase
          console.log("\n📤 Running Publisher Agent...");
          const publisherResult = await publisherAgent([
            {
              role: "user",
              content: JSON.stringify({
                content: result.formattedContent?.formattedContent,
                metadata: result.formattedContent?.metadata,
                platform: route.platform,
              }),
              id: "5",
            },
          ]);

          console.log("\nPublisher Agent Response:");
          for await (const chunk of publisherResult.textStream) {
            process.stdout.write(chunk);
          }

          const publisherToolResults: ToolResult[] =
            await publisherResult.toolResults;
          console.log("\n\nPublisher Tool Results:");
          console.log(JSON.stringify(publisherToolResults, null, 2));
          result.publishedContent = publisherToolResults?.[0]?.result;
        } catch (error) {
          console.error("\n❌ Error in content creation flow:", error);
          throw error;
        }
        break;
      }

      case "create_strategy": {
        try {
          console.log("\n🎯 Running Strategy Agent...");
          const strategyResult = await strategyAgent([
            {
              role: "user",
              content: `Create a content strategy for ${route.platform}`,
              id: "6",
            },
          ]);

          console.log("\nStrategy Agent Response:");
          for await (const chunk of strategyResult.textStream) {
            process.stdout.write(chunk);
          }

          const strategyToolResults: ToolResult[] =
            await strategyResult.toolResults;
          console.log("\n\nStrategy Tool Results:");
          console.log(JSON.stringify(strategyToolResults, null, 2));
          result.strategy = strategyToolResults?.[0]?.result;
        } catch (error) {
          console.error("\n❌ Error in strategy creation flow:", error);
          throw error;
        }
        break;
      }

      case "manage_content": {
        console.log("\n⚙️ Managing existing content...");
        result.strategy = {
          message: "Content management workflow not implemented yet",
        };
        break;
      }
    }

    console.log("\n✅ Orchestration completed successfully");
    return result;
  } catch (error) {
    console.error("\n❌ Orchestration failed:", error);
    throw error;
  }
}

// Example usage:
// const result = await orchestrateAgents("Create a LinkedIn post about AI trends");
// console.log(JSON.stringify(result, null, 2));
