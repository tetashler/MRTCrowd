export interface DayHours {
  first: string;
  last: string;
}

export interface LineHours {
  weekday: DayHours;
  weekend: DayHours;
}

// Sources cross-checked May 2026 against official SBS Transit
// (sbstransit.com.sg/first-train-last-train) for NEL/DTL, SMRT
// Journey Planner & Wikipedia for SMRT-operated lines. The CG branch
// shares EWL hours; the CE branch shares CCL hours. Weekend covers
// Saturday, Sunday, and Public Holidays.
export const OPERATING_HOURS: Record<string, LineHours> = {
  NSL: {
    weekday: { first: '05:00', last: '23:30' },
    weekend: { first: '05:30', last: '23:30' },
  },
  EWL: {
    weekday: { first: '05:00', last: '23:30' },
    weekend: { first: '05:30', last: '23:30' },
  },
  NEL: {
    weekday: { first: '05:39', last: '00:30' },
    weekend: { first: '05:53', last: '00:30' },
  },
  CCL: {
    weekday: { first: '05:30', last: '23:30' },
    weekend: { first: '05:30', last: '23:30' },
  },
  DTL: {
    weekday: { first: '05:30', last: '00:46' },
    weekend: { first: '05:50', last: '00:46' },
  },
  TEL: {
    weekday: { first: '05:36', last: '23:30' },
    weekend: { first: '06:00', last: '23:30' },
  },
};

export const isWeekend = (date: Date = new Date()): boolean => {
  const d = date.getDay();
  return d === 0 || d === 6;
};

export const getTodayHours = (lineCode: string, date: Date = new Date()): DayHours | undefined => {
  const line = OPERATING_HOURS[lineCode];
  if (!line) return undefined;
  return isWeekend(date) ? line.weekend : line.weekday;
};

const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export interface OperatingStatus {
  running: boolean;
  warning: boolean;
  message: string;
}

export const getOperatingStatus = (lineCode: string, now: Date = new Date()): OperatingStatus | null => {
  const hours = getTodayHours(lineCode, now);
  if (!hours) return null;

  const nowMins = now.getHours() * 60 + now.getMinutes();
  const firstMins = toMinutes(hours.first);
  const lastMins = toMinutes(hours.last);
  const crossesMidnight = lastMins < firstMins;

  if (crossesMidnight) {
    if (nowMins <= lastMins) {
      const minsToLast = lastMins - nowMins;
      if (minsToLast <= 30) {
        return { running: true, warning: true, message: `Last train at ${hours.last} — board soon!` };
      }
      return { running: true, warning: false, message: `Operating · Last train ${hours.last}` };
    }
    if (nowMins < firstMins) {
      return { running: false, warning: false, message: `Service starts at ${hours.first}` };
    }
    const minsToLast = lastMins + 24 * 60 - nowMins;
    if (minsToLast <= 30) {
      return { running: true, warning: true, message: `Last train at ${hours.last} — board soon!` };
    }
    return { running: true, warning: false, message: `Operating · Last train ${hours.last}` };
  }

  if (nowMins < firstMins) {
    return { running: false, warning: false, message: `Service starts at ${hours.first}` };
  }
  if (nowMins > lastMins) {
    return { running: false, warning: false, message: `Last train has passed. Service resumes at ${hours.first}` };
  }
  if (nowMins >= lastMins - 30) {
    return { running: true, warning: true, message: `Last train at ${hours.last} — board soon!` };
  }
  return { running: true, warning: false, message: `Operating · Last train ${hours.last}` };
};
