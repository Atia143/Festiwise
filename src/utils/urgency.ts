// ── Festival urgency / FOMO logic ─────────────────────────────────────────────
// Determines whether a festival is approaching and generates urgency signals.

const MONTH_INDEX: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

export type UrgencyLevel = 'critical' | 'high' | 'medium' | null;

export interface UrgencySignal {
  level: UrgencyLevel;
  label: string;
  sublabel: string;
  daysUntil: number;
}

/**
 * Returns the next occurrence (date) of a festival given its months array.
 * If the festival has already passed this year, returns next year's date.
 */
function nextOccurrence(months: string[]): Date | null {
  if (!months || months.length === 0) return null;
  const now = new Date();
  const thisYear = now.getFullYear();
  // Use the first (earliest) month
  const sorted = months
    .map(m => MONTH_INDEX[m.toLowerCase()])
    .filter(i => i !== undefined)
    .sort((a, b) => a - b);

  if (sorted.length === 0) return null;

  // Find the first month that is still upcoming this year
  const upcoming = sorted.find(m => {
    const d = new Date(thisYear, m, 15); // middle of the month
    return d > now;
  });

  if (upcoming !== undefined) {
    return new Date(thisYear, upcoming, 15);
  }
 
  return new Date(thisYear + 1, sorted[0], 15);
}

export function getUrgencySignal(months: string[], status: string): UrgencySignal | null {
  if (status !== 'active') return null;

  const next = nextOccurrence(months);
  if (!next) return null;

  const now = new Date();
  const daysUntil = Math.round((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntil <= 0) return null; // already started

  if (daysUntil <= 30) {
    return {
      level: 'critical',
      label: 'Selling Fast',
      sublabel: daysUntil <= 7
        ? `Only ${daysUntil} days away last chance!`
        : `${daysUntil} days away tickets almost gone`,
      daysUntil,
    };
  }

  if (daysUntil <= 60) {
    return {
      level: 'high',
      label: 'Prices Rising',
      sublabel: `${daysUntil} days to go prices typically increase now`,
      daysUntil,
    };
  }

  if (daysUntil <= 90) {
    return {
      level: 'medium',
      label: 'Early Bird Ending',
      sublabel: `${daysUntil} days away early-bird prices won't last`,
      daysUntil,
    };
  }

  return null;
}
