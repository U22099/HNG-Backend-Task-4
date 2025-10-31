import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// Helper: Get weather conditions from WMO code (simple map)
function getWeatherCondition(code) {
  const conditions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  return conditions[code] || 'Unknown';
}

export const weatherTool = createTool({
  id: 'get-weather',
  description: 'Get current weather for a city or country',
  inputSchema: z.object({
    location: z.string().describe('City or country name, e.g. Lagos or Nigeria'),
  }),
  outputSchema: z.object({
    temperature: z.number().describe('Current temperature in °C'),
    feelsLike: z.number().describe('Feels like temperature in °C'),
    humidity: z.number().describe('Humidity %'),
    windSpeed: z.number().describe('Wind speed in km/h'),
    conditions: z.string().describe('Weather description'),
    location: z.string().describe('Resolved location name'),
  }),
  execute: async ({ context }) => {
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(context.location)}&count=1&language=en&format=json`;
    const geocodingResponse = await fetch(geocodingUrl);
    const geocodingData = await geocodingResponse.json();

    if (!geocodingData.results?.[0]) {
      throw new Error(`Location '${context.location}' not found. Try a city like Lagos or a country like Nigeria.`);
    }

    const { latitude, longitude, name } = geocodingData.results[0];

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto&forecast_days=1`;

    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const current = weatherData.current;

    return {
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      conditions: getWeatherCondition(current.weather_code),
      location: name,
    };
  },
});