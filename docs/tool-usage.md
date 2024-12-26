## How to use the tool config

```javascript
import { createTool } from './types';
import { z } from 'zod';
import type { ToolConfig } from './types';

// Keep the original saveToLog function as is
// ... 

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


// With tracing
const saveTool = createSaveLogTool({ 
  traceId: 'some-id', 
  trace: traceClient 
});

// Without tracing
const saveTool = createSaveLogTool();
```