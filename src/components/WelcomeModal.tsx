import React, { useState } from 'react';
import { useStore } from '../store/useStore';

interface WelcomeModalProps {
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  const [capital, setCapital] = useState('100000');
  const { initializePortfolio } = useStore();

  const handleStart = () => {
    const initialCapital = parseFloat(capital);
    if (initialCapital >= 10000 && initialCapital <= 1000000) {
      initializePortfolio(initialCapital);
      onClose();
    }
  };

  const presetAmounts = [
    { label: '$10K', value: '10000' },
    { label: '$50K', value: '50000' },
    { label: '$100K', value: '100000' },
    { label: '$250K', value: '250000' },
    { label: '$500K', value: '500000' },
    { label: '$1M', value: '1000000' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-panel-strong max-w-md w-full mx-4 p-8 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">QuantSimulate</h1>
          <p className="text-text-secondary">Professional Trading Simulator</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-3">
              Set Your Initial Virtual Capital
            </label>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              {presetAmounts.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setCapital(preset.value)}
                  className={`p-2 text-sm rounded border transition-colors ${
                    capital === preset.value
                      ? 'bg-primary text-white border-primary'
                      : 'bg-bg-accent/30 text-text-secondary border-bg-accent hover:border-primary'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">$</span>
              <input
                type="number"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                min="10000"
                max="1000000"
                step="1000"
                className="w-full pl-8 pr-4 py-3 trading-input text-lg font-semibold"
                placeholder="100,000"
              />
            </div>
            
            <p className="text-xs text-text-muted mt-2">
              Range: $10,000 - $1,000,000
            </p>
          </div>

          <div className="space-y-4">
            <div className="glass-panel p-4 space-y-2">
              <h3 className="font-semibold text-primary">Features Included:</h3>
              <ul className="space-y-1 text-sm text-text-secondary">
                <li>• Real-time stock data & charts</li>
                <li>• Advanced technical indicators</li>
                <li>• Portfolio risk analytics</li>
                <li>• Strategy backtesting</li>
                <li>• Market news & sentiment</li>
              </ul>
            </div>

            <button
              onClick={handleStart}
              disabled={!capital || parseFloat(capital) < 10000 || parseFloat(capital) > 1000000}
              className="w-full trading-button-primary py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Trading
            </button>
          </div>
        </div>

        <p className="text-xs text-text-muted text-center mt-6">
          This is a simulation. No real money is involved.
        </p>
      </div>
    </div>
  );
};

export default WelcomeModal;