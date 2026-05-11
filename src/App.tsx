import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './components/Home';
import { LineScreen } from './components/LineScreen';
import { ThemeProvider } from './context/ThemeContext';
import { ViewProvider } from './context/ViewContext';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <ThemeProvider>
      <ViewProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/line/:lineCode" element={<LineScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Analytics />
      </ViewProvider>
    </ThemeProvider>
  );
}

export default App;
