import { useState } from 'react';
import { Sun, Moon, Search, X } from 'lucide-react';
import { DisruptionBanner } from './DisruptionBanner';
import { LineCard } from './LineCard';
import { FavouriteStations } from './FavouriteStations';
import { MRT_LINES, STATION_NAMES, getLineColor } from '../data/stations';
import { useTheme } from '../context/ThemeContext';

interface HomeProps {
  onSelectLine: (lineCode: string) => void;
}

// Build a flat searchable list of all stations
const ALL_STATIONS = Object.entries(STATION_NAMES).map(([code, name]) => {
  const lineCode = code.replace(/[0-9]/g, '').replace('EW', 'EWL').replace('NS', 'NSL')
    .replace('NE', 'NEL').replace('CC', 'CCL').replace('DT', 'DTL').replace('TE', 'TEL');
  return { code, name, lineCode };
});

export const Home = ({ onSelectLine }: HomeProps) => {
  const [updateKey, setUpdateKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const { isDark, toggleTheme } = useTheme();

  const bg = isDark ? '#0D0D0D' : '#F5F5F5';
  const textPrimary = isDark ? '#FFFFFF' : '#111111';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';
  const inputBg = isDark ? '#1A1A1A' : '#FFFFFF';
  const inputBorder = isDark ? '#2D2D2D' : '#E5E7EB';

  const searchResults = searchQuery.trim().length > 0
    ? ALL_STATIONS.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8)
    : [];

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: bg }}>
      <div className="max-w-md mx-auto p-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: textPrimary }}>MRTCrowd</h1>
            <p className="text-sm mt-1" style={{ color: textSecondary }}>
              Live crowd levels · Singapore MRT
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors duration-200"
            style={{
              backgroundColor: isDark ? '#1A1A1A' : '#E5E7EB',
              color: isDark ? '#FACC15' : '#374151',
            }}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Search bar */}
        <div className="relative mb-5">
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 border"
            style={{ backgroundColor: inputBg, borderColor: inputBorder }}
          >
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: textSecondary }} />
            <input
              type="text"
              placeholder="Search stations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: textPrimary }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}>
                <X className="w-4 h-4" style={{ color: textSecondary }} />
              </button>
            )}
          </div>

          {/* Search results dropdown */}
          {searchResults.length > 0 && (
            <div
              className="absolute top-full left-0 right-0 mt-1 rounded-xl border overflow-hidden z-20 shadow-lg"
              style={{ backgroundColor: inputBg, borderColor: inputBorder }}
            >
              {searchResults.map(station => (
                <button
                  key={station.code}
                  onClick={() => {
                    onSelectLine(station.lineCode);
                    setSearchQuery('');
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left transition-colors"
                  style={{ borderBottom: `1px solid ${inputBorder}` }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = isDark ? '#242424' : '#F3F4F6')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {/* Line colour dot */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold"
                    style={{ backgroundColor: getLineColor(station.lineCode), fontSize: '9px' }}
                  >
                    {station.lineCode.replace('L', '')}
                  </div>
                  <div>
                    <div className="font-medium text-sm" style={{ color: textPrimary }}>{station.name}</div>
                    <div className="text-xs" style={{ color: textSecondary }}>{station.code}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {searchQuery.trim().length > 0 && searchResults.length === 0 && (
            <div
              className="absolute top-full left-0 right-0 mt-1 rounded-xl border px-4 py-3 z-20"
              style={{ backgroundColor: inputBg, borderColor: inputBorder }}
            >
              <p className="text-sm" style={{ color: textSecondary }}>No stations found</p>
            </div>
          )}
        </div>

        <DisruptionBanner />

        <FavouriteStations key={updateKey} onUpdate={() => setUpdateKey(prev => prev + 1)} />

        <div className="space-y-3">
          {MRT_LINES.map(line => (
            <LineCard key={line.code} line={line} onClick={() => onSelectLine(line.code)} />
          ))}
        </div>
      </div>
    </div>
  );
};