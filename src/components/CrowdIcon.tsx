type CrowdLevel = 'l' | 'm' | 'h';

interface CrowdIconProps {
  level: CrowdLevel | null | undefined;
}

const GREY = '#6b7280';

const LEVELS: Record<CrowdLevel, { color: string; count: number }> = {
  l: { color: '#22c55e', count: 1 },
  m: { color: '#f59e0b', count: 2 },
  h: { color: '#ef4444', count: 3 },
};

const Person = ({ color }: { color: string }) => (
  <svg
    width="2"
    height="3.5"
    viewBox="0 0 6 10"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block' }}
  >
    <circle cx="3" cy="2" r="1.6" fill={color} />
    <path d="M0.5 9.5 Q0.5 4.5 3 4.5 Q5.5 4.5 5.5 9.5 Z" fill={color} />
  </svg>
);

export const CrowdIcon = ({ level }: CrowdIconProps) => {
  if (!level) return null;
  const { color, count } = LEVELS[level];
  return (
    <div style={{ display: 'flex', width: 6, height: 3.5, lineHeight: 0 }}>
      {[0, 1, 2].map(i => (
        <Person key={i} color={i < count ? color : GREY} />
      ))}
    </div>
  );
};
