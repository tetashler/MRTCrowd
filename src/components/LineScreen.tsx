import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams, Navigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Clock } from 'lucide-react';
import { StationCard } from './StationCard';
import { LINE_STATIONS, MRT_LINES, getLineColor } from '../data/stations';
import { addFavourite, removeFavourite, isFavourite } from '../utils/favourites';
import { useTheme } from '../context/ThemeContext';
import { useCrowdData } from '../hooks/useCrowdData';

const OPERATING_HOURS: Record<string, { first: string; last: string }> = {
  NSL: { first: '05:30', last: '23:18' },
  EWL: { first: '05:13', last: '23:59' },
  NEL: { first: '05:30', last: '23:17' },
  CCL: { first: '05:30', last: '23:59' },
  DTL: { first: '05:30', last: '23:59' },
  TEL: { first: '05:30', last: '23:59' },
};

const getOperatingStatus = (lineCode: string) => {
  const hours = OPERATING_HOURS[lineCode];
  if (!hours) return null;

  const now = new Date();
  const [firstH, firstM] = hours.first.split(':').map(Number);
  const [lastH, lastM] = hours.last.split(':').map(Number);

  const nowMins = now.getHours() * 60 + now.getMinutes();
  const firstMins = firstH * 60 + firstM;
  const lastMins = lastH * 60 + lastM;

  if (nowMins < firstMins) {
    return { running: false, message: `Service starts at ${hours.first}` };
  }
  if (nowMins > lastMins) {
    return { running: false, message: `Last train has passed. Service resumes at ${hours.first}` };
  }
  if (nowMins >= lastMins - 30) {
    return { running: true, warning: true, message: `Last train at ${hours.last} — board soon!` };
  }
  return { running: true, warning: false, message: `Operating · Last train ${hours.last}` };
};

export const LineScreen = () => {
  const navigate = useNavigate();
  const { lineCode = '' } = useParams<{ lineCode: string }>();
  const [searchParams] = useSearchParams();
  const highlightStation = searchParams.get('station');

  const { crowdData, loading, refreshing, lastUpdated, refresh } = useCrowdData();
  const [favourites, setFavourites] = useState<Set<string>>(new Set());
  const [highlightedStation, setHighlightedStation] = useState<string | null>(highlightStation);

  const { isDark } = useTheme();
  const line = MRT_LINES.find(l => l.code === lineCode);
  const stations = LINE_STATIONS[lineCode] || [];
  const lineColor = getLineColor(lineCode);
  const opStatus = getOperatingStatus(lineCode);

  const onBack = () => navigate(-1);

  const bg = isDark ? '#0D0D0D' : '#F5F5F5';
  const headerBg = isDark ? '#0D0D0D' : '#F5F5F5';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';

  const loadFavourites = () => {
    const favs = new Set<string>();
    stations.forEach(station => {
      if (isFavourite(station)) favs.add(station);
    });
    setFavourites(favs);
  };

  useEffect(() => {
    loadFavourites();
  }, [lineCode]);

  useEffect(() => {
    if (highlightStation && !loading) {
      const element = document.getElementById(`station-${highlightStation}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        setTimeout(() => setHighlightedStation(null), 3000);
      }
    }
  }, [highlightStation, loading]);

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
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  };

  if (!line) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: bg }}>
      <div className="max-w-md mx-auto">

        {/* Sticky header */}
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
              onClick={refresh}
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

          {/* Operating hours banner */}
          {opStatus && (
            <div
              className="mt-2 rounded-lg px-3 py-2 flex items-center gap-2"
              style={{
                backgroundColor: !opStatus.running
                  ? 'rgba(239,68,68,0.1)'
                  : opStatus.warning
                    ? 'rgba(234,179,8,0.1)'
                    : 'rgba(34,197,94,0.1)',
              }}
            >
              <Clock
                className="w-3.5 h-3.5 flex-shrink-0"
                style={{
                  color: !opStatus.running ? '#EF4444' : opStatus.warning ? '#EAB308' : '#22C55E',
                }}
              />
              <p
                className="text-xs"
                style={{
                  color: !opStatus.running ? '#EF4444' : opStatus.warning ? '#EAB308' : '#22C55E',
                }}
              >
                {opStatus.message}
              </p>
            </div>
          )}
        </div>

        {/* Station list */}
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
                  <div
                    key={stationCode}
                    id={`station-${stationCode}`}
                    className="relative flex items-center gap-3"
                    style={{
                      transition: 'all 0.3s ease',
                      ...(highlightedStation === stationCode && {
                        transform: 'scale(1.02)',
                        filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))',
                      }),
                    }}
                  >
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