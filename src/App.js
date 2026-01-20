import React, { useState, useEffect } from 'react';
import { Wallet, ChevronDown, ArrowUpDown, Github, Twitter, Zap, Database, CheckCircle, Sparkles, TrendingUp, Lock } from 'lucide-react';
import './App.css';

// Move exchangeRates outside component to prevent re-creation on every render
const EXCHANGE_RATES = {
  'SOL-USDC': 102.50,
  'USDC-SOL': 0.00976,
  'SOL-USDT': 102.30,
  'USDT-SOL': 0.00978,
  'SOL-RAY': 68.5,
  'RAY-SOL': 0.0146,
  'USDC-USDT': 0.9998,
  'USDT-USDC': 1.0002,
  'SOL-BONK': 15000000,
  'BONK-SOL': 0.00000007,
  'USDC-BONK': 146341,
  'BONK-USDC': 0.00000683,
};

const BALANCES = {
  SOL: 2.5,
  USDC: 150.75,
  USDT: 200.00,
  RAY: 45.20,
  BONK: 1000000
};

function App() {
  const [sellAmount, setSellAmount] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [sellToken, setSellToken] = useState('SOL');
  const [buyToken, setBuyToken] = useState('USDC');
  const [mounted, setMounted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showPermission, setShowPermission] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => {
      setShowPermission(true);
    }, 2000);
    
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    if (sellAmount && parseFloat(sellAmount) > 0) {
      const rate = EXCHANGE_RATES[`${sellToken}-${buyToken}`] || 1;
      const result = (parseFloat(sellAmount) * rate).toFixed(6);
      setBuyAmount(result);
    } else {
      setBuyAmount('');
    }
  }, [sellAmount, sellToken, buyToken]);

  const handleAllowConnection = () => {
    setIsConnecting(true);
    setShowPermission(false);
    setTimeout(() => {
      setShowWelcome(false);
      setIsConnecting(false);
    }, 1500);
  };

  const handleBlockConnection = () => {
    setShowPermission(false);
    setTimeout(() => {
      setShowWelcome(false);
    }, 1000);
  };

  const handleConnectWallet = () => {
    setIsWalletConnected(true);
    const fakeAddress = '0x' + Math.random().toString(16).substr(2, 8).toUpperCase();
    setWalletAddress(fakeAddress);
  };

  const handleDisconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress('');
  };

  const handleSwap = () => {
    setIsSwapping(true);
    setShowSuccess(false);
    
    setTimeout(() => {
      setIsSwapping(false);
      setShowSuccess(true);
      setSellAmount('');
      setBuyAmount('');
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }, 2000);
  };

  const flipTokens = () => {
    const tempToken = sellToken;
    setSellToken(buyToken);
    setBuyToken(tempToken);
    const tempAmount = sellAmount;
    setSellAmount(buyAmount);
    setBuyAmount(tempAmount);
  };

  const setMaxAmount = () => {
    const balance = BALANCES[sellToken] || 0;
    const maxAmount = sellToken === 'SOL' ? Math.max(0, balance - 0.01) : balance;
    setSellAmount(maxAmount.toString());
  };

  return (
    <>
      {showWelcome && (
        <div className={`welcome-screen ${!showWelcome ? 'fade-out' : ''}`}>
          <div className="welcome-glow"></div>
          <div className="welcome-content">
            <div className="welcome-logo-container">
              <img src="/logo.png" alt="Hackaton Swap" className="welcome-logo" />
              <div className="logo-ring"></div>
              <div className="logo-ring-2"></div>
            </div>
            <h1 className="welcome-title">
              <span className="title-word">HACKATON</span>
              <span className="title-word">SWAP</span>
            </h1>
            <div className="hexagon-container">
              <svg className="hexagon" viewBox="0 0 100 100" width="120" height="120">
                <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="none" stroke="url(#gradient)" strokeWidth="3" />
                <polygon points="50,15 80,32.5 80,67.5 50,85 20,67.5 20,32.5" fill="none" stroke="url(#gradient)" strokeWidth="2" opacity="0.6" />
                <polygon points="50,25 70,37.5 70,62.5 50,75 30,62.5 30,37.5" fill="none" stroke="url(#gradient)" strokeWidth="2" opacity="0.3" />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5FD895" />
                    <stop offset="100%" stopColor="#4BC884" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <p className="welcome-status">
              {isConnecting ? 'Establishing connection...' : 'Connecting to network...'}
            </p>
          </div>

          {showPermission && (
            <div className="permission-popup">
              <div className="permission-glow"></div>
              <button className="permission-close" onClick={handleBlockConnection}>×</button>
              <div className="permission-content">
                <div className="permission-icon">
                  <Database size={24} />
                </div>
                <p className="permission-text">Look for and connect to any device on your local network</p>
                <div className="permission-buttons">
                  <button className="permission-btn allow-btn" onClick={handleAllowConnection}>
                    <Sparkles size={16} />
                    Allow
                  </button>
                  <button className="permission-btn block-btn" onClick={handleBlockConnection}>
                    Block
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={`app-container ${mounted ? 'mounted' : ''}`}>
        {/* Animated Background */}
        <div className="bg-gradient"></div>
        <div className="bg-gradient-2"></div>
        
        {/* Floating Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}

        <header className="header">
          <div className="logo-section">
            <div className="logo-wrapper">
              <img src="/logo.png" alt="Hackaton Swap Logo" className="pill-logo-img" />
              <div className="logo-glow"></div>
            </div>
            <h1 className="site-title">
              HACKATON <span className="title-swap">SWAP</span>
            </h1>
          </div>

          <div className="nav-section">
            <NavButton icon={<Twitter size={20} />} label="X" url="https://twitter.com" />
            <NavButton icon={<Github size={20} />} label="GitHub" url="https://github.com" />
            <NavButton icon={<Zap size={20} />} label="Pump.Fun" url="https://pump.fun" />
            <NavButton icon={<Database size={20} />} label="API" url="https://jup.ag/api" />
            
            {!isWalletConnected ? (
              <button onClick={handleConnectWallet} className="connect-wallet-btn">
                <Wallet size={20} />
                <span>Connect Wallet</span>
                <div className="button-glow"></div>
              </button>
            ) : (
              <button onClick={handleDisconnectWallet} className="connect-wallet-btn connected">
                <CheckCircle size={20} />
                <span>{walletAddress}</span>
              </button>
            )}
          </div>
        </header>

        <main className="main-content">
          <div className="swap-section">
            <div className="section-header">
              <h2 className="swap-title">
                <TrendingUp size={32} className="title-icon" />
                Swap Tokens
              </h2>
              <p className="swap-subtitle">Trade at the best rates on Solana</p>
            </div>

            <div className="swap-container">
              <div className="container-glow"></div>
              
              {/* WALLET NOT CONNECTED OVERLAY - BIG AND CLEAR! */}
              {!isWalletConnected && (
                <div className="wallet-connect-overlay">
                  <div className="overlay-blur"></div>
                  <div className="overlay-content">
                    <div className="overlay-icon-container">
                      <Lock size={56} className="overlay-lock-icon" />
                      <Wallet size={40} className="overlay-wallet-icon" />
                    </div>
                    <h3 className="overlay-title">Connect Wallet First</h3>
                    <p className="overlay-subtitle">You need to connect your wallet before you can swap tokens</p>
                    <button onClick={handleConnectWallet} className="overlay-connect-button">
                      <Wallet size={20} />
                      <span>Connect Wallet Now</span>
                      <Sparkles size={18} />
                    </button>
                    <p className="overlay-hint">Click the button above to get started</p>
                  </div>
                </div>
              )}
              
              <div className="network-indicator">
                <span className="network-dot"></span>
                <span>Devnet</span>
                <span className="demo-badge">Demo Mode</span>
              </div>

              {showSuccess && (
                <div className="success-message">
                  <div className="success-icon">
                    <CheckCircle size={20} />
                  </div>
                  <div className="success-content">
                    <span className="success-title">Swap Successful!</span>
                    <span className="success-subtitle">Your transaction has been processed</span>
                  </div>
                </div>
              )}

              <div className="token-section">
                <label className="token-label">
                  <span>Sell</span>
                  <span className="label-balance">Balance: {BALANCES[sellToken].toFixed(4)}</span>
                </label>
                <div className={`token-input-container ${!isWalletConnected ? 'disabled' : ''}`}>
                  <div className="token-input-row">
                    <input
                      type="number"
                      value={sellAmount}
                      onChange={(e) => setSellAmount(e.target.value)}
                      placeholder="0.00"
                      className="token-amount-input"
                      disabled={!isWalletConnected}
                    />
                    <TokenSelector token={sellToken} onChange={setSellToken} exclude={buyToken} disabled={!isWalletConnected} />
                  </div>
                  <div className="token-info-row">
                    <span className="usd-value">≈ ${sellAmount ? (parseFloat(sellAmount) * 100).toFixed(2) : '0.00'}</span>
                    <button onClick={setMaxAmount} className="max-button" disabled={!isWalletConnected}>
                      <Sparkles size={14} />
                      Max
                    </button>
                  </div>
                </div>
              </div>

              <div className="swap-icon-container">
                <button onClick={flipTokens} className="swap-icon-button" disabled={!isWalletConnected}>
                  <ArrowUpDown size={24} />
                  <div className="swap-button-glow"></div>
                </button>
              </div>

              <div className="token-section">
                <label className="token-label">
                  <span>Buy</span>
                  <span className="label-balance">Balance: {BALANCES[buyToken].toFixed(4)}</span>
                </label>
                <div className={`token-input-container ${!isWalletConnected ? 'disabled' : ''}`}>
                  <div className="token-input-row">
                    <input
                      type="number"
                      value={buyAmount}
                      readOnly
                      placeholder="0.00"
                      className="token-amount-input"
                    />
                    <TokenSelector token={buyToken} onChange={setBuyToken} exclude={sellToken} disabled={!isWalletConnected} />
                  </div>
                  <div className="token-info-row">
                    <span className="usd-value">≈ ${buyAmount ? (parseFloat(buyAmount) * 1).toFixed(2) : '0.00'}</span>
                    <span className="rate-badge">Live Rate</span>
                  </div>
                </div>
              </div>

              {sellAmount && buyAmount && (
                <div className="exchange-rate">
                  <div className="rate-info">
                    <TrendingUp size={16} />
                    <span>1 {sellToken} ≈ {(parseFloat(buyAmount) / parseFloat(sellAmount)).toFixed(6)} {buyToken}</span>
                  </div>
                  <span className="price-impact">
                    Impact: <span className="impact-value">0.1%</span>
                  </span>
                </div>
              )}

              <button
                onClick={isWalletConnected ? handleSwap : handleConnectWallet}
                disabled={isWalletConnected && (!sellAmount || isSwapping)}
                className={`action-button ${isWalletConnected && sellAmount ? 'ready' : ''} ${isSwapping ? 'swapping' : ''}`}
              >
                <div className="action-button-content">
                  {!isWalletConnected ? (
                    <>
                      <Wallet size={20} />
                      <span>CONNECT WALLET TO SWAP</span>
                    </>
                  ) : isSwapping ? (
                    <>
                      <div className="spinner"></div>
                      <span>SWAPPING...</span>
                    </>
                  ) : !sellAmount ? (
                    <>
                      <Sparkles size={20} />
                      <span>ENTER AMOUNT</span>
                    </>
                  ) : (
                    <>
                      <Zap size={20} />
                      <span>SWAP TOKENS</span>
                    </>
                  )}
                </div>
                <div className="action-button-glow"></div>
              </button>
            </div>
          </div>
        </main>

        <footer className="footer">
          <p>Powered by Hackaton Swap • Demo Mode • Not for production use</p>
        </footer>
      </div>
    </>
  );
}

const NavButton = ({ icon, label, url }) => {
  return (
    <button className="nav-button" onClick={() => window.open(url, '_blank')}>
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
      <div className="nav-button-glow"></div>
    </button>
  );
};

const TokenSelector = ({ token, onChange, exclude, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const tokenData = {
    SOL: {
      symbol: 'SOL',
      name: 'Solana',
      logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
    },
    USDC: {
      symbol: 'USDC',
      name: 'USD Coin',
      logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
    },
    USDT: {
      symbol: 'USDT',
      name: 'Tether',
      logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
    },
    RAY: {
      symbol: 'RAY',
      name: 'Raydium',
      logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png'
    },
    BONK: {
      symbol: 'BONK',
      name: 'Bonk',
      logo: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I'
    }
  };
  
  const tokens = Object.keys(tokenData).filter(t => t !== exclude);
  const currentToken = tokenData[token];
  
  return (
    <div className="token-selector">
      <button onClick={() => !disabled && setIsOpen(!isOpen)} className="token-selector-button" disabled={disabled}>
        <img src={currentToken.logo} alt={token} className="token-logo" onError={(e) => e.target.style.display = 'none'} />
        <span className="token-symbol">{token}</span>
        <ChevronDown size={16} className={`chevron ${isOpen ? 'open' : ''}`} />
        <div className="selector-glow"></div>
      </button>
      
      {isOpen && !disabled && (
        <>
          <div className="dropdown-backdrop" onClick={() => setIsOpen(false)}></div>
          <div className="token-dropdown">
            <div className="dropdown-glow"></div>
            {tokens.map((t) => {
              const tokenInfo = tokenData[t];
              return (
                <button
                  key={t}
                  onClick={() => {
                    onChange(t);
                    setIsOpen(false);
                  }}
                  className={`token-option ${t === token ? 'active' : ''}`}
                >
                  <img src={tokenInfo.logo} alt={t} className="token-logo-small" onError={(e) => e.target.style.display = 'none'} />
                  <div className="token-info">
                    <span className="token-symbol-dropdown">{t}</span>
                    <span className="token-name">{tokenInfo.name}</span>
                  </div>
                  {t === token && <CheckCircle size={16} className="check-icon" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default App;