import { useState } from 'react';
import { Home } from './components/Home';
import { LineScreen } from './components/LineScreen';
import { ThemeProvider } from './context/ThemeContext';
import { ViewProvider } from './context/ViewContext';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const [selectedLine, setSelectedLine] = useState<string | null>(null);

  return (
    <ThemeProvider>
      <ViewProvider>
        {selectedLine ? (
          <LineScreen lineCode={selectedLine} onBack={() => setSelectedLine(null)} />
        ) : (
          <Home onSelectLine={setSelectedLine} />
        )}
        <Analytics />
      </ViewProvider>
    </ThemeProvider>
  );
}

export default App;