import { getUrgencySignal } from '@/utils/urgency';

interface Props {
  months: string[];
  status: string;
  size?: 'sm' | 'md';
  showSublabel?: boolean;
}

const LEVEL_STYLES = {
  critical: {
    pill: 'bg-red-500 text-white shadow-md shadow-red-500/30 animate-pulse',
    bar:  'bg-red-500',
    dot:  'bg-red-400',
  },
  high: {
    pill: 'bg-amber-500 text-white shadow-md shadow-amber-500/25',
    bar:  'bg-amber-500',
    dot:  'bg-amber-400',
  },
  medium: {
    pill: 'bg-orange-400 text-white',
    bar:  'bg-orange-400',
    dot:  'bg-orange-300',
  },
};

export default function UrgencyBadge({ months, status, size = 'sm', showSublabel = false }: Props) {
  const signal = getUrgencySignal(months, status);
  if (!signal || !signal.level) return null;

  const styles = LEVEL_STYLES[signal.level];
  const padding = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <div className="flex flex-col gap-1">
      <span className={`inline-flex items-center gap-1.5 font-bold rounded-full ${padding} ${styles.pill}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} flex-shrink-0`} />
        {signal.label}
      </span>
      {showSublabel && (
        <p className="text-xs text-gray-500 font-medium pl-1">{signal.sublabel}</p>
      )}
    </div>
  );
}
