import { orchestrateAgents } from "../agents/orchestrator";

async function main() {
  try {
    // Example 1: Create content
    console.log("\n🚀 Example 1: Creating a LinkedIn post about AI trends");
    console.log("=".repeat(80));
    const contentResult = await orchestrateAgents(
      "Create a LinkedIn post about the latest AI trends in software development"
    );
    console.log("\n📋 Final Result:");
    console.log("-".repeat(40));
    console.log(JSON.stringify(contentResult, null, 2));
    console.log("=".repeat(80));

    // Wait a bit before next example
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Example 2: Create strategy
    console.log("\n🚀 Example 2: Creating a Twitter content strategy");
    console.log("=".repeat(80));
    const strategyResult = await orchestrateAgents(
      "Create a content strategy for our Twitter account focused on tech news"
    );
    console.log("\n📋 Final Result:");
    console.log("-".repeat(40));
    console.log(JSON.stringify(strategyResult, null, 2));
    console.log("=".repeat(80));

    // Wait a bit before next example
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Example 3: Manage content
    console.log("\n🚀 Example 3: Managing existing content");
    console.log("=".repeat(80));
    const managementResult = await orchestrateAgents(
      "Update our blog post about machine learning"
    );
    console.log("\n📋 Final Result:");
    console.log("-".repeat(40));
    console.log(JSON.stringify(managementResult, null, 2));
    console.log("=".repeat(80));
  } catch (error) {
    console.error("\n❌ Error in example execution:");
    if (error instanceof Error) {
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
    } else {
      console.error("Unknown error:", error);
    }
    process.exit(1);
  }
}

// Run the examples if this file is being run directly
if (require.main === module) {
  console.log("🤖 Starting Content Management System Examples...");
  main().catch((error) => {
    console.error("\n💥 Fatal error in main execution:", error);
    process.exit(1);
  });
}

export { main };
