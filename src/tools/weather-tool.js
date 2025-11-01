import { addDays, format, startOfDay } from "date-fns";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

function getWeatherCondition(code) {
  const conditions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return conditions[code] || "Unknown";
}

export const weatherTool = createTool({
  id: "get-weather",
  description: "Get current weather for a city or country",
  inputSchema: z.object({
    location: z.string().describe("City or country name"),
    date: z
      .enum(["today", "tomorrow"])
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
      .optional()
      .describe('Date: "today", "tomorrow", or ISO "2025-11-15"'),
  }),
  outputSchema: z.object({
    temperature: z.number().describe("Current temperature in °C"),
    feelsLike: z.number().describe("Feels like temperature in °C"),
    humidity: z.number().describe("Humidity %"),
    windSpeed: z.number().describe("Wind speed in km/h"),
    conditions: z.string().describe("Weather description"),
    location: z.string().describe("Resolved location name"),
  }),
  execute: async ({ context }) => {
    const { location, date: dateInput } = context;

    let targetDate = new Date();
    if (dateInput === "tomorrow") targetDate = addDays(targetDate, 1);
    else if (dateInput && dateInput !== "today")
      targetDate = new Date(dateInput);

    const dateStr = format(startOfDay(targetDate), "yyyy-MM-dd");

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      location
    )}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    const geo = await geoRes.json();
    if (!geo.results?.[0]) throw new Error(`Location '${location}' not found`);

    const { latitude, longitude, name } = geo.results[0];

    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto&start_date=${dateStr}&end_date=${dateStr}`;
    const res = await fetch(forecastUrl);
    const data = await res.json();

    const hourIdx = data.hourly.time.findIndex((t) => t.includes("T12:00"));
    if (hourIdx === -1) throw new Error("No noon data");

    const h = data.hourly;
    return {
      temperature: h.temperature_2m[hourIdx],
      feelsLike: h.apparent_temperature[hourIdx],
      humidity: h.relative_humidity_2m[hourIdx],
      windSpeed: h.wind_speed_10m[hourIdx],
      conditions: getWeatherCondition(h.weather_code[hourIdx]),
      location: name,
      date: format(targetDate, "EEEE, MMMM d"),
    };
  },
});
