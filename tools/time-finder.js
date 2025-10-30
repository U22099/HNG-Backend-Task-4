import { z } from 'zod';
import { createTool } from '@mastra/core';
import { toZonedTime, toDate, format } from 'date-fns-tz';
import { addMinutes, setHours, startOfDay, addDays } from 'date-fns';

export const timeFinderTool = createTool({
  id: 'find-meeting-slots',
  description: 'Find overlapping work hours between two timezones',
  inputSchema: z.object({
    tz1: z.string(),
    tz2: z.string(),
    duration: z.number().default(30),
    date: z.string().optional()
  }),
  execute: async ({ tz1, tz2, duration, date }) => {
    const baseDate = date === 'tomorrow' || !date
      ? addDays(new Date(), 1)
      : new Date(date);
    const day = startOfDay(baseDate);

    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      const startUtc = toDate(setHours(day, hour), { timeZone: tz1 });
      const endUtc = addMinutes(startUtc, duration);

      if (toZonedTime(endUtc, tz1).getHours() >= 18) continue;

      const startInTz2 = toZonedTime(startUtc, tz2);
      const hourInTz2 = startInTz2.getHours();
      if (hourInTz2 < 9 || hourInTz2 >= 18) continue;

      slots.push({
        [tz1]: format(startUtc, 'h:mm a'),
        [tz2]: format(startInTz2, 'h:mm a'),
        duration,
        utcStart: startUtc.toISOString()
      });
    }

    return { slots: slots.slice(0, 3) };
  },
});