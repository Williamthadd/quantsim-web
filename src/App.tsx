import { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import WelcomeModal from './components/WelcomeModal';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StockDetail from './components/StockDetail';
import Portfolio from './components/Portfolio';
import Research from './components/Research';
import Backtest from './components/Backtest';
import './App.css';

function App() {
  const { userSession, activeTab, sidebarOpen } = useStore();
  const [showWelcome, setShowWelcome] = useState(!userSession);

  useEffect(() => {
    if (userSession) {
      setShowWelcome(false);
    }
  }, [userSession]);

  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'stock-detail':
        return <StockDetail />;
      case 'portfolio':
        return <Portfolio />;
      case 'research':
        return <Research />;
      case 'backtest':
        return <Backtest />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen font-mono" style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
      
      {!showWelcome && (
        <div className="flex h-screen flex-col lg:flex-row">
          {/* Sidebar */}
          <div className={`transition-all duration-300 ${sidebarOpen ? 'w-full lg:w-64' : 'w-16'} ${sidebarOpen ? 'h-auto lg:h-full' : 'h-16 lg:h-full'}`}>
            <Sidebar />
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Header */}
            <Header />
            
            {/* Main Content */}
            <main className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6">
              {renderMainContent()}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
