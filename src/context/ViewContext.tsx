import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ViewMode = 'list' | 'map';

interface ViewContextType {
  viewMode: ViewMode;
  toggleView: () => void;
  isMapView: boolean;
}

const ViewContext = createContext<ViewContextType>({
  viewMode: 'list',
  toggleView: () => {},
  isMapView: false,
});

export const ViewProvider = ({ children }: { children: ReactNode }) => {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('mrtcrowd-view');
    return (saved === 'map' ? 'map' : 'list') as ViewMode;
  });

  useEffect(() => {
    localStorage.setItem('mrtcrowd-view', viewMode);
  }, [viewMode]);

  const toggleView = () => {
    setViewMode(prev => (prev === 'list' ? 'map' : 'list'));
  };

  return (
    <ViewContext.Provider value={{ viewMode, toggleView, isMapView: viewMode === 'map' }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useView = () => useContext(ViewContext);
