import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { timeAgent } from '../agents/time-agent.js';
import { a2aAgentRoute } from '../routes/a2a-agent-route';

export const mastra = new Mastra({
  agents: { timeAgent },
  storage: new LibSQLStore({ url: ":memory:" }),
  logger: new PinoLogger({
    name: 'Mastra',
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
