import { Agent } from "@mastra/core";
import { timeFinderTool } from "../tools/time-finder.js";

export const timeAgent = new Agent({
  name: 'Time Agent',
  model: 'google/gemini-1.5-flash',
  instructions: `
    You are a smart scheduling assistant.
    - Always ask for missing info: timezone1, timezone2, duration
    - Use "tomorrow" if no date given
    - Return ONLY the top 3 overlapping slots in working hours (9 AM–6 PM local)
    - Format: "HH:MM TZ → HH:MM TZ"
    - Be friendly but concise
  `,
  tools: { timeFinderTool }
});