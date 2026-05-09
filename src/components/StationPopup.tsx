import { X, Clock } from 'lucide-react';
import { getStationName, getLineColor, INTERCHANGE_LINES } from '../data/stations';
import { useTheme } from '../context/ThemeContext';

interface StationPopupProps {
  stationCode: string;
  crowdLevel?: 'l' | 'm' | 'h';
  onClose: () => void;
}

const getCrowdBadge = (level: 'l' | 'm' | 'h') => {
  switch (level) {
    case 'l':
      return { emoji: '🟢', label: 'Low', color: 'bg-green-600/20 text-green-400 border-green-500/30' };
    case 'm':
      return { emoji: '🟡', label: 'Moderate', color: 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30' };
    case 'h':
      return { emoji: '🔴', label: 'High', color: 'bg-red-600/20 text-red-400 border-red-500/30' };
  }
};

const OPERATING_HOURS: Record<string, { first: string; last: string }> = {
  NSL: { first: '05:30', last: '23:18' },
  EWL: { first: '05:13', last: '23:59' },
  NEL: { first: '05:30', last: '23:17' },
  CCL: { first: '05:30', last: '23:59' },
  DTL: { first: '05:30', last: '23:59' },
  TEL: { first: '05:30', last: '23:59' },
};

export const StationPopup = ({ stationCode, crowdLevel, onClose }: StationPopupProps) => {
  const { isDark } = useTheme();
  const badge = crowdLevel ? getCrowdBadge(crowdLevel) : null;
  const interchangeLines = INTERCHANGE_LINES[stationCode] || [];

  const lineCode = stationCode.replace(/[0-9]/g, '').replace('EW', 'EWL').replace('NS', 'NSL')
    .replace('NE', 'NEL').replace('CC', 'CCL').replace('DT', 'DTL').replace('TE', 'TEL');
  const lineColor = getLineColor(lineCode);
  const hours = OPERATING_HOURS[lineCode];

  const cardBg = isDark ? '#1A1A1A' : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#111111';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="rounded-xl p-4 shadow-2xl max-w-sm w-full animate-in fade-in zoom-in duration-200"
        style={{ backgroundColor: cardBg }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: lineColor, fontSize: '10px' }}
              >
                {lineCode.replace('L', '')}
              </div>
              {interchangeLines.map(line => (
                <div
                  key={line}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: getLineColor(line), fontSize: '10px' }}
                >
                  {line.replace('L', '')}
                </div>
              ))}
            </div>
            <h3 className="font-bold text-lg" style={{ color: textPrimary }}>
              {getStationName(stationCode)}
            </h3>
            <p className="text-sm" style={{ color: textSecondary }}>{stationCode}</p>
          </div>
          <button onClick={onClose} className="p-1" style={{ color: textSecondary }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {badge && (
          <div className={`px-3 py-2 rounded-lg text-sm border ${badge.color} flex items-center gap-2 mb-3`}>
            <span>{badge.emoji}</span>
            <span className="font-medium">{badge.label} crowd level</span>
          </div>
        )}

        {hours && (
          <div className="flex items-center gap-2 text-sm" style={{ color: textSecondary }}>
            <Clock className="w-4 h-4" />
            <span>Operating: {hours.first} - {hours.last}</span>
          </div>
        )}
      </div>
    </div>
  );
};
