import { useState } from 'react';
import { DisruptionBanner } from './DisruptionBanner';
import { LineCard } from './LineCard';
import { FavouriteStations } from './FavouriteStations';
import { MRT_LINES } from '../data/stations';

interface HomeProps {
  onSelectLine: (lineCode: string) => void;
}

export const Home = ({ onSelectLine }: HomeProps) => {
  const [updateKey, setUpdateKey] = useState(0);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <div className="max-w-md mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">MRTCrowd</h1>
          <p className="text-gray-400 text-sm mt-1">Live crowd levels · Singapore MRT</p>
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
