import { useState } from 'react';
import { Home } from './components/Home';
import { LineScreen } from './components/LineScreen';

function App() {
  const [selectedLine, setSelectedLine] = useState<string | null>(null);

  return (
    <>
      {selectedLine ? (
        <LineScreen lineCode={selectedLine} onBack={() => setSelectedLine(null)} />
      ) : (
        <Home onSelectLine={setSelectedLine} />
      )}
    </>
  );
}

export default App;
