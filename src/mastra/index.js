import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherAgent } from '../agents/weather-agent';
import { a2aAgentRoute } from '../routes/a2a-agent-route';

export const mastra = new Mastra({
  agents: { weatherAgent },
  storage: new LibSQLStore({ url: ":memory:" }),
  logger: new PinoLogger({
    name: 'Mastra Weather',
    level: 'debug',
  }),
  observability: {
    default: { enabled: true },
  },
  server: {
    build: {
      openAPIDocs: true,
      swaggerUI: true,
    },
    apiRoutes: [a2aAgentRoute]
  }
});