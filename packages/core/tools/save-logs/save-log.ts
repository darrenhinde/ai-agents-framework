import * as fs from 'node:fs';
import * as path from 'node:path';
import { tool } from 'ai';
import type { LangfuseTraceClient } from 'langfuse';
import { z } from 'zod';
import { createTool } from '../types.config';
import type { ToolConfig } from '../types.config';

/**
 * Saves or appends text to a log file
 * @param filename The name/path of the log file
 * @param text The text content to save/append
 */
export async function saveToLog(filename: string, text: string): Promise<void> {
    try {
        // Ensure the directory exists
        const dir = path.dirname(filename);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Append text to file, creating it if it doesn't exist
        await fs.promises.appendFile(filename, `${text}\n`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to save to log file: ${error.message}`);
        }
        throw new Error('An unknown error occurred while saving to log file');
    }
}

export const createSaveLogTool = (config?: ToolConfig) => createTool({
  name: 'save-log',
  description: 'Saves or appends text content to a log file',
  parameters: z.object({
    filename: z.string().describe('The name/path of the log file'),
    text: z.string().describe('The text content to save/append'),
  }),
  execute: async ({ filename, text }) => {
    await saveToLog(filename, text);
    return { success: true };
  },
  config,
});
