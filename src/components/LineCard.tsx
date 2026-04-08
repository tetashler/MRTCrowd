import { MRTLine } from '../data/stations';
import { useTheme } from '../context/ThemeContext';

interface LineCardProps {
  line: MRTLine;
  onClick: () => void;
}

export const LineCard = ({ line, onClick }: LineCardProps) => {
  const { isDark } = useTheme();

  const cardBg = isDark ? '#1A1A1A' : '#FFFFFF';
  const cardHover = isDark ? '#242424' : '#F3F4F6';
  const textPrimary = isDark ? '#FFFFFF' : '#111111';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';

  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg p-4 flex items-center gap-4 transition-colors duration-200"
      style={{ backgroundColor: cardBg, borderLeft: `4px solid ${line.color}` }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = cardHover)}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = cardBg)}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm text-white"
        style={{ backgroundColor: line.color }}
      >
        {line.code}
      </div>
      <div className="flex-1 text-left">
        <h3 className="font-semibold text-lg" style={{ color: textPrimary }}>{line.name}</h3>
        <p className="text-sm" style={{ color: textSecondary }}>{line.fullName}</p>
      </div>
      <span style={{ color: textSecondary }} className="text-lg">›</span>
    </button>
  );
};