import { useState } from 'react';
import { Home } from './components/Home';
import { LineScreen } from './components/LineScreen';
import { ThemeProvider } from './context/ThemeContext';
import { ViewProvider } from './context/ViewContext';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  const handleSelectLine = (lineCode: string, stationCode?: string) => {
    setSelectedLine(lineCode);
    setSelectedStation(stationCode || null);
  };

  const handleBack = () => {
    setSelectedLine(null);
    setSelectedStation(null);
  };

  return (
    <ThemeProvider>
      <ViewProvider>
        {selectedLine ? (
          <LineScreen
            lineCode={selectedLine}
            highlightStation={selectedStation}
            onBack={handleBack}
          />
        ) : (
          <Home onSelectLine={handleSelectLine} />
        )}
        <Analytics />
      </ViewProvider>
    </ThemeProvider>
  );
}

export default App;