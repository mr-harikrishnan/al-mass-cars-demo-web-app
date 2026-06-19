import React, { useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { AppRoutes } from './routes/AppRoutes';
import { seedInitialData } from './utils/storage';

function App() {
  useEffect(() => {
    seedInitialData();
  }, []);

  return (
    <HashRouter>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <AppRoutes />
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </HashRouter>
  );
}

export default App;
