import { MRTLine } from '../data/stations';

interface LineCardProps {
  line: MRTLine;
  onClick: () => void;
}

export const LineCard = ({ line, onClick }: LineCardProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-[#1A1A1A] rounded-lg p-4 flex items-center gap-4 hover:bg-[#242424] transition-colors"
      style={{ borderLeft: `4px solid ${line.color}` }}
    >
      {/* Coloured circle with line code */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
        style={{ backgroundColor: line.color, color: '#fff' }}
      >
        {line.code}
      </div>
      <div className="flex-1 text-left">
        <h3 className="text-white font-semibold text-lg">{line.name}</h3>
        <p className="text-gray-400 text-sm">{line.fullName}</p>
      </div>
      <span className="text-gray-600 text-lg">›</span>
    </button>
  );
};
