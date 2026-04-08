import { useEffect, useState } from 'react';
import { Star, X } from 'lucide-react';
import { getFavourites, removeFavourite, Favourite } from '../utils/favourites';
import { getStationName, getLineColor } from '../data/stations';
import { CrowdDataResponse } from '../types/api';
import { useTheme } from '../context/ThemeContext';

const getCrowdBadge = (level: 'l' | 'm' | 'h') => {
  switch (level) {
    case 'l':
      return { label: 'Low', color: 'bg-green-600/20 text-green-400 border-green-500/30' };
    case 'm':
      return { label: 'Moderate', color: 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30' };
    case 'h':
      return { label: 'High', color: 'bg-red-600/20 text-red-400 border-red-500/30' };
  }
};

export const FavouriteStations = ({ onUpdate }: { onUpdate?: () => void }) => {
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [crowdData, setCrowdData] = useState<Map<string, 'l' | 'm' | 'h'>>(new Map());
  const { isDark } = useTheme();

  const cardBg = isDark ? '#1A1A1A' : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#111111';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';

  const loadFavourites = () => setFavourites(getFavourites());

  const fetchCrowdData = async () => {
    try {
      const uniqueLines = [...new Set(favourites.map(f => f.lineCode))];
      const allData = new Map<string, 'l' | 'm' | 'h'>();

      for (const lineCode of uniqueLines) {
        const response = await fetch(`/api/lta?endpoint=PCDRealTime&TrainLine=${lineCode}`);
        const data: CrowdDataResponse = await response.json();
        if (data.value) {
          data.value.forEach(station => {
            allData.set(station.Station, station.CrowdLevel);
          });
        }
      }

      setCrowdData(allData);
    } catch (error) {
      console.error('Failed to fetch crowd data:', error);
    }
  };

  useEffect(() => { loadFavourites(); }, []);

  useEffect(() => {
    if (favourites.length > 0) {
      fetchCrowdData();
      const interval = setInterval(fetchCrowdData, 60000);
      return () => clearInterval(interval);
    }
  }, [favourites]);

  const handleRemove = (stationCode: string) => {
    removeFavourite(stationCode);
    loadFavourites();
    onUpdate?.();
  };

  if (favourites.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        <h2 className="font-semibold text-lg" style={{ color: textPrimary }}>Favourites</h2>
      </div>
      <div className="space-y-2">
        {favourites.map(fav => {
          const crowdLevel = crowdData.get(fav.stationCode);
          const badge = crowdLevel ? getCrowdBadge(crowdLevel) : null;
          const lineColor = getLineColor(fav.lineCode);

          return (
            <div
              key={fav.stationCode}
              className="rounded-lg p-3 flex items-center gap-3 transition-colors duration-300"
              style={{ backgroundColor: cardBg, borderLeft: `3px solid ${lineColor}` }}
            >
              <div className="flex-1">
                <div className="font-medium" style={{ color: textPrimary }}>
                  {getStationName(fav.stationCode)}
                </div>
                <div className="text-sm" style={{ color: textSecondary }}>{fav.stationCode}</div>
              </div>
              {badge && (
                <div className={`px-2 py-1 rounded text-xs border ${badge.color}`}>
                  {badge.label}
                </div>
              )}
              <button
                onClick={() => handleRemove(fav.stationCode)}
                style={{ color: textSecondary }}
                className="hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};