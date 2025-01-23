import type { Langfuse } from "langfuse";

/**
 * Types for Langfuse observations with proper typing based on their documentation
 */

/**
 * Base interface for all Langfuse observations
 * @property name - Identifier of the observation
 * @property id - Optional custom ID for the observation
 * @property metadata - Additional context as key-value pairs
 * @property input - Input data for the observation
 * @property output - Output data from the observation
 * @property level - Log level for filtering and UI highlighting
 * @property statusMessage - Additional context message (e.g. error details)
 * @property version - Version identifier for debugging
 * @property tags - Array of tags for filtering
 */
export interface BaseObservation {
  name: string;
  id?: string;
  metadata?: Record<string, unknown>;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  level?: "DEBUG" | "DEFAULT" | "WARNING" | "ERROR";
  statusMessage?: string;
  version?: string;
  tags?: string[];
}

/**
 * Interface for Langfuse traces - top level observation
 * @extends BaseObservation
 * @property userId - ID of the user that triggered the execution
 * @property sessionId - Session/thread identifier
 * @property public - Whether the trace is publicly viewable
 */
export interface TraceObservation extends BaseObservation {
  userId?: string;
  sessionId?: string;
  public?: boolean;
}

/**
 * Interface for Langfuse events - discrete points in time
 * @extends BaseObservation
 * @property startTime - When the event occurred
 * @property traceId - ID of the parent trace
 * @property parentObservationId - ID of the parent observation
 */
export interface EventObservation extends BaseObservation {
  startTime?: Date;
  traceId?: string;
  parentObservationId?: string;
}

/**
 * Interface for Langfuse spans - duration of work
 * @extends EventObservation
 * @property endTime - When the span completed
 */
export interface SpanObservation extends EventObservation {
  endTime?: Date;
}

/**
 * Interface for model parameters in generations
 */
export interface ModelParameters {
  temperature?: number | null;
  maxTokens?: number | null;
  topP?: number | null;
  frequencyPenalty?: number | null;
  presencePenalty?: number | null;
  stop?: string[] | null;
  [key: string]: string | number | boolean | string[] | null | undefined;
}

/**
 * Interface for usage tracking in generations
 */
export interface UsageInfo {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  input?: number;
  output?: number;
  total?: number;
  unit?: "TOKENS" | "CHARACTERS" | "MILLISECONDS" | "SECONDS" | "IMAGES";
  inputCost?: number;
  outputCost?: number;
  totalCost?: number;
}

/**
 * Interface for Langfuse generations - AI model executions
 * @extends SpanObservation
 * @property model - Name/identifier of the model used
 * @property modelParameters - Configuration used for the generation
 * @property completionStartTime - When the model started generating
 * @property usage - Token and cost tracking
 */
export interface GenerationObservation extends SpanObservation {
  model?: string;
  modelParameters?: ModelParameters;
  completionStartTime?: Date;
  usage?: UsageInfo;
}

/**
 * Configuration for the Langfuse logger
 */
export interface LangfuseLoggerConfig {
  langfuse: Langfuse;
  defaultUserId?: string;
  defaultSessionId?: string;
  defaultTags?: string[];
  traceConfig?: {
    name?: string;
    tags?: string[];
    metadata?: Record<string, unknown>;
  };
}

/**
 * Creates a Langfuse logger instance for structured logging of AI operations
 */
export function createLangfuseLogger(config: LangfuseLoggerConfig) {
  let currentTrace: ReturnType<Langfuse["trace"]> | undefined;

  /**
   * Starts a new trace for a sequence of operations
   */
  function startTrace(params: {
    name?: string;
    userId?: string;
    sessionId?: string;
    metadata?: Record<string, unknown>;
    tags?: string[];
  }) {
    const mergedTags = [...(config.defaultTags || []), ...(params.tags || [])];

    currentTrace = config.langfuse.trace({
      name: params.name || config.traceConfig?.name || "default-trace",
      userId: params.userId || config.defaultUserId,
      sessionId: params.sessionId || config.defaultSessionId,
      tags: mergedTags,
      metadata: {
        ...config.traceConfig?.metadata,
        ...params.metadata,
      },
    });

    return currentTrace;
  }

  /**
   * Logs an event within the current trace
   */
  function logEvent(params: {
    name: string;
    level?: "DEBUG" | "DEFAULT" | "WARNING" | "ERROR";
    metadata?: Record<string, unknown>;
    input?: Record<string, unknown>;
    output?: Record<string, unknown>;
  }) {
    if (!currentTrace) {
      console.warn("Attempting to log event without active trace");
      return;
    }

    return currentTrace.event({
      name: params.name,
      level: params.level,
      metadata: {
        ...params.metadata,
        defaultTags: config.defaultTags,
      },
      input: params.input,
      output: params.output,
    });
  }

  /**
   * Gets the current active trace
   */
  function getCurrentTrace() {
    return currentTrace;
  }

  /**
   * Updates the current trace with additional information
   */
  function updateTrace(params: {
    metadata?: Record<string, unknown>;
    input?: Record<string, unknown>;
    output?: Record<string, unknown>;
    level?: "DEBUG" | "DEFAULT" | "WARNING" | "ERROR";
    statusMessage?: string;
  }) {
    if (!currentTrace) {
      console.warn("Attempting to update trace without active trace");
      return;
    }

    return currentTrace.update(params);
  }

  /**
   * Ends the current trace and flushes logs
   */
  async function endTrace() {
    if (currentTrace) {
      await config.langfuse.flushAsync();
      currentTrace = undefined;
    }
  }

  return {
    startTrace,
    logEvent,
    getCurrentTrace,
    updateTrace,
    endTrace,
  };
}
