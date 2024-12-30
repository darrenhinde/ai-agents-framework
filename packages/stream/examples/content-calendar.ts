import { calendarAgent } from "../agents/calendar-agent";

async function main() {
  try {
    // Example 1: Create a Content Strategy with Matrix
    console.log("\n🚀 Example 1: Creating Content Strategy with Matrix");
    console.log("=".repeat(80));

    const strategyResult = await calendarAgent([
      {
        role: "user",
        content: `Create a comprehensive content strategy with these details:

Mission: Help tech professionals and businesses leverage AI and automation effectively.

Target Audience: Software developers, tech leaders, and businesses interested in AI adoption.

Topics:
1. AI Development
2. Software Automation
3. Tech Leadership
4. Developer Productivity

Content Types:
- Actionable tutorials
- Success stories
- Technical analysis
- Industry insights
- Comparative studies

Content Formats:
- LinkedIn: Mix of carousels, articles, and videos
- Twitter: Threads and short videos
- Blog: In-depth technical articles

Please provide:
1. Content matrix with ideas for each topic
2. Monthly content calendar
3. Posting schedule recommendations
4. Engagement strategies`,
        id: "1",
      },
    ]);

    console.log("\n📋 Strategy Result:");
    console.log("-".repeat(40));
    for await (const chunk of strategyResult.textStream) {
      process.stdout.write(chunk);
    }
    console.log("\n", "-".repeat(40));
    const strategyToolResults = await strategyResult.toolResults;
    console.log(JSON.stringify(strategyToolResults, null, 2));
    console.log("=".repeat(80));

    // Wait a bit before next example
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Example 2: Generate Content Ideas using Matrix
    console.log("\n🚀 Example 2: Generating Content Ideas using Matrix");
    console.log("=".repeat(80));

    const ideasResult = await calendarAgent([
      {
        role: "user",
        content: `Generate content ideas using the matrix approach for the topic "AI Development":

Content Types to consider:
1. [Actionable] - Step-by-step tutorials
2. [Motivational] - Success stories
3. [Analytical] - Deep dives
4. [Contrarian] - Unique perspectives
5. [Observation] - Industry trends

Please provide 2-3 ideas for each content type, focusing on engaging and valuable content.`,
        id: "2",
      },
    ]);

    console.log("\n📋 Ideas Result:");
    console.log("-".repeat(40));
    for await (const chunk of ideasResult.textStream) {
      process.stdout.write(chunk);
    }
    console.log("\n", "-".repeat(40));
    const ideasToolResults = await ideasResult.toolResults;
    console.log(JSON.stringify(ideasToolResults, null, 2));
    console.log("=".repeat(80));

    // Wait a bit before next example
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Example 3: Create Monthly Calendar from Strategy
    console.log("\n🚀 Example 3: Creating Monthly Calendar from Strategy");
    console.log("=".repeat(80));

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const calendarResult = await calendarAgent([
      {
        role: "user",
        content: `Create a detailed content calendar from ${startDate.toISOString()} to ${endDate.toISOString()} based on our content strategy.

Requirements:
1. Follow the content matrix approach
2. Mix different content types and formats
3. Include specific posting times
4. Add relevant hashtags
5. Provide content descriptions

Focus on these series:
- Weekly deep dives on AI development
- Daily quick tips for developers
- Tech news roundups
- Case studies on successful implementations`,
        id: "3",
      },
    ]);

    console.log("\n📋 Calendar Result:");
    console.log("-".repeat(40));
    for await (const chunk of calendarResult.textStream) {
      process.stdout.write(chunk);
    }
    console.log("\n", "-".repeat(40));
    const calendarToolResults = await calendarResult.toolResults;
    console.log(JSON.stringify(calendarToolResults, null, 2));
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
  console.log("🤖 Starting Content Calendar Management Examples...");
  main().catch((error) => {
    console.error("\n💥 Fatal error in main execution:", error);
    process.exit(1);
  });
}

export { main };
