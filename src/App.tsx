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
        <div className="flex h-screen flex-col">
          {/* Mobile Layout */}
          <div className="lg:hidden flex flex-col h-full">
            {/* Mobile Sidebar - Top */}
            <div className={`transition-all duration-300 flex-shrink-0 ${
              sidebarOpen ? 'h-auto' : 'h-16'
            }`}>
              <Sidebar />
            </div>
            
            {/* Mobile Header - Only show search when sidebar is closed */}
            {!sidebarOpen && (
              <div className="flex-shrink-0">
                <Header />
              </div>
            )}
            
            {/* Mobile Main Content */}
            <main className="flex-1 overflow-auto p-3 sm:p-4">
              {renderMainContent()}
            </main>
            
            {/* Mobile Footer */}
            <footer className="flex-shrink-0 p-3 border-t border-bg-accent/30">
              <div className="text-center">
                <a 
                  href="https://www.linkedin.com/in/william-thaddeus-6151751a7/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-primary transition-colors text-sm"
                >
                  Made by me
                </a>
              </div>
            </footer>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden lg:flex lg:flex-row lg:h-full">
            {/* Desktop Sidebar - Left */}
            <div className={`transition-all duration-300 flex-shrink-0 ${
              sidebarOpen ? 'w-64' : 'w-16'
            }`}>
              <Sidebar />
            </div>
            
            {/* Desktop Main Content Area */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Desktop Header */}
              <Header />
              
              {/* Desktop Main Content */}
              <main className="flex-1 overflow-auto p-6">
                {renderMainContent()}
              </main>
              
              {/* Desktop Footer */}
              <footer className="flex-shrink-0 p-4 border-t border-bg-accent/30">
                <div className="text-center">
                  <a 
                    href="https://www.linkedin.com/in/william-thaddeus-6151751a7/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-primary transition-colors text-sm"
                  >
                    Made by me
                  </a>
                </div>
              </footer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
