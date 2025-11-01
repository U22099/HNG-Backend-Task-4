import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { weatherTool } from "../tools/weather-tool";

export const weatherAgent = new Agent({
  name: "WeatherSync",
  instructions: `
    You are WeatherSync, a helpful weather assistant.

    RULES:
    - Accept "today", "tomorrow", or any date (e.g. "Nov 15", "2025-12-25")
    - If no date → default to **today**
    - If no location → ask for location
    - Provide accurate weather info using the **weatherTool** tool
    - Always use **weatherTool** with { location, date: (which can only be "today", "tomorrow" or an ISO formatted date eg "yyyy-mm-dd") }
    - Format:
      "On [Date] in [Location]: [Conditions], [Temp]°C (feels like [Feels]°C), Humidity [Hum]%, Wind [Wind] km/h"
    - If asked for activities, suggest 1–2 based on conditions
    - Be concise and friendly

    RealTime Info: Today's date is ${(new Date()).toISOString().split("T")[0]}
  `,
  model: "google/gemini-2.0-flash",
  tools: { weatherTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: ":memory:",
    }),
  }),
});
