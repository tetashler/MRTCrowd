import { Star } from 'lucide-react';
import { getStationName } from '../data/stations';

interface StationCardProps {
  stationCode: string;
  crowdLevel?: 'l' | 'm' | 'h';
  lineColor: string;
  isFavourite: boolean;
  onToggleFavourite: () => void;
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

export const StationCard = ({
  stationCode,
  crowdLevel,
  lineColor,
  isFavourite,
  onToggleFavourite,
}: StationCardProps) => {
  const badge = crowdLevel ? getCrowdBadge(crowdLevel) : null;

  return (
    <div
      className="bg-[#1A1A1A] rounded-lg p-4 flex items-center gap-3"
      style={{ borderLeft: `3px solid ${lineColor}` }}
    >
      <div className="flex-1">
        <h3 className="text-white font-semibold text-lg">{getStationName(stationCode)}</h3>
        <p className="text-gray-400 text-sm">{stationCode}</p>
      </div>

      {badge && (
        <div className={`px-3 py-1.5 rounded-md text-sm border ${badge.color} flex items-center gap-2`}>
          <span>{badge.emoji}</span>
          <span>{badge.label}</span>
        </div>
      )}

      <button
        onClick={onToggleFavourite}
        className="text-gray-400 hover:text-yellow-500 transition-colors"
      >
        <Star
          className={`w-6 h-6 ${isFavourite ? 'fill-yellow-500 text-yellow-500' : ''}`}
        />
      </button>
    </div>
  );
};
