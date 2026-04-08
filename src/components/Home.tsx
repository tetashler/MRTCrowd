import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { DisruptionBanner } from './DisruptionBanner';
import { LineCard } from './LineCard';
import { FavouriteStations } from './FavouriteStations';
import { MRT_LINES } from '../data/stations';
import { useTheme } from '../context/ThemeContext';

interface HomeProps {
  onSelectLine: (lineCode: string) => void;
}

export const Home = ({ onSelectLine }: HomeProps) => {
  const [updateKey, setUpdateKey] = useState(0);
  const { isDark, toggleTheme } = useTheme();

  const bg = isDark ? '#0D0D0D' : '#F5F5F5';
  const textPrimary = isDark ? '#FFFFFF' : '#111111';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: bg }}>
      <div className="max-w-md mx-auto p-4">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: textPrimary }}>MRTLeh</h1>
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