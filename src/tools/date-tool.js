import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const getCurrentDateTool = createTool({
  id: 'get-current-date',
  description: 'Returns the current date in ISO format (yyyy-mm-dd)',
  inputSchema: z.object({}),
  outputSchema: z.object({
    isoDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Today in ISO format'),
    readable: z.string().describe('Human-readable date'),
  }),
  execute: async () => {
    const now = new Date();
    const isoDate = now.toISOString().split('T')[0];
    const readable = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return { isoDate, readable };
  },
});