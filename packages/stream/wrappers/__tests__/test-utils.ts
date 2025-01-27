import {
  LanguageModelV1,
  Message,
  ToolExecutionOptions,
  LanguageModelV1CallOptions,
  LanguageModelV1FunctionToolCall,
  LanguageModelV1FinishReason,
  LanguageModelV1Response,
} from "ai";
import { mock } from "bun:test";

// Mock tool execution options
export const createMockToolOptions = (
  overrides = {}
): ToolExecutionOptions => ({
  timeoutMs: 1000,
  ...overrides,
});
