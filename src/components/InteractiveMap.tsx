import { useState } from 'react';
import { STATIONS, type Station, type CrowdLevel } from '../data/mrtStations';
import { useCrowdData } from '../hooks/useCrowdData';

const LINE_COLORS: Record<string, string> = {
  NS: '#d42e12',
  EW: '#009645',
  CC: '#fa9e0d',
  DT: '#005ec4',
  TE: '#9D5B25',
  NE: '#9900aa',
  CG: '#009645',
};

const CROWD_COLORS: Record<string, string> = {
  Low: '#22c55e',
  Moderate: '#f59e0b',
  High: '#ef4444',
};

const convertCrowdLevel = (level: 'l' | 'm' | 'h'): CrowdLevel => {
  if (level === 'l') return 'Low';
  if (level === 'm') return 'Moderate';
  return 'High';
};

export default function InteractiveMap() {
  const [activeLines, setActiveLines] = useState<Set<string>>(
    new Set(['NS', 'EW', 'CC', 'DT', 'TE', 'NE', 'CG'])
  );
  const [popup, setPopup] = useState<{
    station: Station;
    x: number;
    y: number;
  } | null>(null);

  const { crowdData, loading } = useCrowdData();

  const toggleLine = (line: string) => {
    setActiveLines(prev => {
      const next = new Set(prev);
      if (next.has(line)) {
        next.delete(line);
      } else {
        next.add(line);
      }
      return next;
    });
  };

  const handleDotClick = (station: Station, e: React.MouseEvent) => {
    e.stopPropagation();
    const isTouchDevice = 'ontouchstart' in window;

    if (isTouchDevice) {
      setPopup({ station, x: 0, y: 0 });
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      let x = rect.left + rect.width / 2;
      let y = rect.top;

      if (window.visualViewport) {
        const vp = window.visualViewport;
        x = (x - vp.offsetLeft) / vp.scale + vp.offsetLeft;
        y = (y - vp.offsetTop) / vp.scale + vp.offsetTop;
      }

      setPopup({ station, x, y });
    }
  };

  const visibleStations = STATIONS.filter(s =>
    s.lines.some(l => activeLines.has(l))
  ).map(s => {
    const raw = crowdData.get(s.id);
    return {
      ...s,
      crowd: raw ? convertCrowdLevel(raw) : ('Low' as CrowdLevel),
    };
  });

  return (
    <div className="flex flex-col h-full bg-[#0d1117]" onClick={() => setPopup(null)}>
      <div className="flex gap-2 p-4 bg-[#161b22] border-b border-[#30363d] flex-wrap">
        {['NS', 'EW', 'CC', 'DT', 'TE', 'NE', 'CG'].map(line => (
          <button
            key={line}
            onClick={() => toggleLine(line)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-opacity ${activeLines.has(line) ? 'opacity-100' : 'opacity-40'
              }`}
            style={{ backgroundColor: LINE_COLORS[line], color: '#fff' }}
          >
            {line}
          </button>
        ))}
        <div className="ml-auto text-[10px] text-[#484f58] self-center">
          Click a station for details
        </div>
      </div>

      <div className="flex-1 relative overflow-auto">
        <img
          src="/mrt-system-map.png"
          alt="MRT System Map"
          className="w-full h-full object-contain"
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0d1117] bg-opacity-50">
            <div className="text-[#8b949e] text-sm">Loading crowd data...</div>
          </div>
        )}
        <div className="absolute inset-0 pointer-events-none">
          {visibleStations.map(station => {
            const size = station.lines.length > 1 ? 13 : 9;
            return (
              <div
                key={station.id}
                className="absolute pointer-events-auto cursor-pointer"
                style={{
                  left: `${station.x}%`,
                  top: `${station.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={(e) => handleDotClick(station, e)}
              >
                <div style={{ width: size, height: size }} />
              </div>
            );
          })}
        </div>
      </div>

      {popup && (() => {
        const isTouchDevice = 'ontouchstart' in window;
        return (
          <div
            className="fixed z-[200] bg-[#1c2128] border border-[#30363d] rounded-xl p-4 w-60 shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
            style={
              isTouchDevice
                ? { bottom: '80px', left: '50%', transform: 'translateX(-50%)' }
                : { left: popup.x, top: popup.y - 10, transform: 'translate(-50%, -100%)' }
            }
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPopup(null)}
              className="absolute top-2 right-2 text-[#8b949e] hover:text-white transition-colors"
              aria-label="Close"
            >
              ×
            </button>
            <div className="text-[15px] font-bold mb-2">{popup.station.name}</div>
            <div className="flex gap-1.5 flex-wrap mb-2.5">
              {popup.station.lines.map(line => (
                <span
                  key={line}
                  className="px-2 py-0.5 rounded text-xs font-semibold text-white"
                  style={{ backgroundColor: LINE_COLORS[line] }}
                >
                  {line}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-[13px] mb-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: CROWD_COLORS[popup.station.crowd] }}
              />
              <span>{popup.station.crowd}</span>
            </div>
            <div className="text-[11px] text-[#8b949e]">⏰ 5:30am – 12:00am</div>
          </div>
        );
      })()}

      <div className="p-3 bg-[#161b22] border-t border-[#30363d] flex gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
          <span className="text-[#8b949e]">Low</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
          <span className="text-[#8b949e]">Moderate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
          <span className="text-[#8b949e]">High</span>
        </div>
      </div>
    </div>
  );
}