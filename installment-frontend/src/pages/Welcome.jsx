import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import Header from '../components/Header';

function Welcome({ theme, setTheme }) {
  // Placeholder for user's name, to be replaced with real data from API
  const userName = 'User';
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div style={{ position: 'fixed', top: 24, right: 32, zIndex: 200 }}>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="theme-switch-btn">
          {theme === 'light' ? <span role="img" aria-label="moon">🌙</span> : <span role="img" aria-label="sun">☀️</span>}
        </button>
      </div>
      <div className={`welcome-root ${theme}-mode`} style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        background: `url('/mip-logo.jpg') center center / cover no-repeat, ${theme === 'dark' ? '#181c24' : 'var(--bg, #f4faff)'}`,
        position: 'relative',
      }}>
        {/* Overlay for readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: theme === 'dark' ? 'rgba(24,28,36,0.82)' : 'rgba(244,250,255,0.82)',
          zIndex: 0
        }} />
        <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ marginBottom: 32 }}>Welcome, {userName}!</h1>
          <button className="welcome-btn" onClick={() => navigate('/dashboard?mine=1')}>
            <span>My Projects</span>
          </button>
          <button className="welcome-btn" onClick={() => navigate('/financialinfo')}>
            <span>Financial Info</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Welcome; 