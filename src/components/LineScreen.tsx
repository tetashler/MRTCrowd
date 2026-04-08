import { useEffect, useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { StationCard } from './StationCard';
import { LINE_STATIONS, MRT_LINES, getLineColor } from '../data/stations';
import { addFavourite, removeFavourite, isFavourite } from '../utils/favourites';
import { CrowdDataResponse } from '../types/api';
import { useTheme } from '../context/ThemeContext';

interface LineScreenProps {
  lineCode: string;
  onBack: () => void;
}

export const LineScreen = ({ lineCode, onBack }: LineScreenProps) => {
  const [crowdData, setCrowdData] = useState<Map<string, 'l' | 'm' | 'h'>>(new Map());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [favourites, setFavourites] = useState<Set<string>>(new Set());

  const { isDark } = useTheme();
  const line = MRT_LINES.find(l => l.code === lineCode);
  const stations = LINE_STATIONS[lineCode] || [];
  const lineColor = getLineColor(lineCode);

  const bg = isDark ? '#0D0D0D' : '#F5F5F5';
  const headerBg = isDark ? '#0D0D0D' : '#F5F5F5';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';

  const fetchCrowdData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await fetch(`/api/lta?endpoint=PCDRealTime&TrainLine=${lineCode}`);
      const data: CrowdDataResponse = await response.json();

      const newCrowdData = new Map<string, 'l' | 'm' | 'h'>();
      if (data.value) {
        data.value.forEach(station => {
          newCrowdData.set(station.Station, station.CrowdLevel);
        });
      }

      setCrowdData(newCrowdData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch crowd data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadFavourites = () => {
    const favs = new Set<string>();
    stations.forEach(station => {
      if (isFavourite(station)) favs.add(station);
    });
    setFavourites(favs);
  };

  useEffect(() => {
    fetchCrowdData();
    loadFavourites();
    const interval = setInterval(() => fetchCrowdData(true), 60000);
    return () => clearInterval(interval);
  }, [lineCode]);

  const handleToggleFavourite = (stationCode: string) => {
    if (favourites.has(stationCode)) {
      removeFavourite(stationCode);
      setFavourites(prev => {
        const next = new Set(prev);
        next.delete(stationCode);
        return next;
      });
    } else {
      const success = addFavourite(stationCode, lineCode);
      if (success) {
        setFavourites(prev => new Set(prev).add(stationCode));
      } else {
        alert('Maximum 5 favourites allowed');
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-SG', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: bg }}>
      <div className="max-w-md mx-auto">
        <div
          className="sticky top-0 z-50 px-4 pt-4 pb-3 transition-colors duration-300"
          style={{
            backgroundColor: headerBg,
            borderBottom: isDark ? '1px solid #1f1f1f' : '1px solid #E5E7EB',
            boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.8)' : '0 4px 16px rgba(0,0,0,0.08)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1 rounded-full transition-colors"
              style={{ color: textSecondary }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 flex-1">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: lineColor }} />
              <div>
                <h1 className="text-xl font-bold leading-tight" style={{ color: lineColor }}>
                  {line?.name}
                </h1>
                <p className="text-xs" style={{ color: textSecondary }}>{line?.fullName}</p>
              </div>
            </div>
            <button
              onClick={() => fetchCrowdData(true)}
              disabled={refreshing}
              className="p-1 rounded-full transition-colors disabled:opacity-50"
              style={{ color: textSecondary }}
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          {lastUpdated && (
            <p className="text-xs text-center mt-2" style={{ color: isDark ? '#4B5563' : '#9CA3AF' }}>
              Updated {formatTime(lastUpdated)}
            </p>
          )}
        </div>

        <div className="px-4 pb-8 pt-4">
          {loading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg p-4 h-[72px] animate-pulse"
                  style={{ backgroundColor: isDark ? '#1A1A1A' : '#E5E7EB' }}
                />
              ))}
            </div>
          ) : (
            <div className="relative">
              <div
                className="absolute w-[2px] top-4 bottom-4"
                style={{ left: '10px', backgroundColor: `${lineColor}35` }}
              />
              <div className="space-y-2">
                {stations.map((stationCode) => (
                  <div key={stationCode} className="relative flex items-center gap-3">
                    <div
                      className="flex-shrink-0 rounded-full"
                      style={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: lineColor,
                        marginLeft: '5.5px',
                        boxShadow: `0 0 6px ${lineColor}80`,
                      }}
                    />
                    <div className="flex-1">
                      <StationCard
                        stationCode={stationCode}
                        crowdLevel={crowdData.get(stationCode)}
                        lineColor={lineColor}
                        isFavourite={favourites.has(stationCode)}
                        onToggleFavourite={() => handleToggleFavourite(stationCode)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};