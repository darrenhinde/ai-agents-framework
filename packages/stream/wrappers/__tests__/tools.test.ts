import { describe, expect, it, mock, spyOn } from "bun:test";
import { wrapTool } from "../tools";
import { z } from "zod";
import type { Logger } from "../logger";
import type { CoreTool } from "ai";

/**
 * Test Suite: Tool Wrapper
 *
 * This suite tests the core functionality of the tool wrapper,
 * focusing on resilience, error handling, and proper logging integration.
 */
describe("Tool Wrapper", () => {
  /**
   * Test: Tool Execution with Logging Failure
   *
   * Purpose:
   * Verify that a tool executes successfully and returns results even if logging operations fail.
   * This ensures our tools are resilient to logging infrastructure issues.
   *
   * Test Cases:
   * 1. Logger's startSpan throws an error
   * 2. Logger's updateSpan throws an error
   * 3. Logger's endSpan throws an error
   *
   * Expected Behavior:
   * - Tool should execute successfully
   * - Tool should return expected results
   * - Original errors from logging should be caught and not propagate
   * - Warning messages should be logged for each logging failure
   */
  it("should execute successfully even when logging fails", async () => {
    console.log("\n🧪 Testing tool execution with failing logger...");
    console.log(
      "📝 Expected: Tool should work even when all logging operations fail"
    );

    // Spy on console.warn to verify warning messages
    const warnSpy = spyOn(console, "warn");

    // Create a mock logger that throws errors
    const mockLogger: Partial<Logger> = {
      startSpan: mock(() => {
        throw new Error("startSpan failed");
      }),
      updateSpan: mock(() => {
        throw new Error("updateSpan failed");
      }),
      endSpan: mock(() => {
        throw new Error("endSpan failed");
      }),
    };

    // Create a simple test tool
    const testTool = wrapTool({
      description: "Test tool",
      parameters: z.object({
        input: z.string(),
      }),
      execute: async ({ input }) => {
        return { result: `${input}-processed` };
      },
    });

    // Initialize the tool with our failing logger
    const tool = testTool(mockLogger as Logger);

    // Type assertion for the tool's execute function
    const execute = tool.execute as (args: {
      input: string;
    }) => Promise<{ result: string }>;

    // Execute the tool
    const result = await execute({ input: "test" });

    // Verify the tool executed successfully despite logging failures
    expect(result).toEqual({ result: "test-processed" });

    // Verify logging methods were called
    expect(mockLogger.startSpan).toHaveBeenCalled();
    expect(mockLogger.updateSpan).toHaveBeenCalled();
    expect(mockLogger.endSpan).toHaveBeenCalled();

    // Verify warning messages were logged
    expect(warnSpy).toHaveBeenCalledTimes(3);
    expect(warnSpy).toHaveBeenCalledWith(
      "Failed to start logging span:",
      expect.any(Error)
    );
    expect(warnSpy).toHaveBeenCalledWith(
      "Failed to update logging span:",
      expect.any(Error)
    );
    expect(warnSpy).toHaveBeenCalledWith(
      "Failed to end logging span:",
      expect.any(Error)
    );

    console.log("✅ Tool executed successfully despite logging failures");
    console.log("✅ All logging methods failed as expected");
    console.log("✅ Warning messages were logged correctly");
    console.log("🎉 Test completed successfully!\n");
  });
});
