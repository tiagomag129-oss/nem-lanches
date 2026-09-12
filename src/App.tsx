import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PublicBioPage } from './components/public/PublicBioPage';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Loader2 } from 'lucide-react';

const MainRouter: React.FC = () => {
  const { isAuthenticated, authChecking } = useApp();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname === '/admin' ? '/admin' : '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname === '/admin' ? '/admin' : '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  // If on admin route
  if (currentPath === '/admin') {
    if (authChecking) {
      return (
        <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center text-white p-4">
          <Loader2 className="w-8 h-8 text-[#E63922] animate-spin mb-2" />
          <p className="text-xs text-neutral-400">Carregando painel...</p>
        </div>
      );
    }

    if (isAuthenticated) {
      return <AdminDashboard onNavigateToPublic={() => navigateTo('/')} />;
    }

    return <AdminLogin onBackToSite={() => navigateTo('/')} />;
  }

  // Default public bio page
  return <PublicBioPage onNavigateToAdmin={() => navigateTo('/admin')} />;
};

export function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}

export default App;
