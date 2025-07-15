import React, { useRef, useLayoutEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Dashboard.css';
import Header from '../components/Header';

function UserInfo({ theme, setTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const active = location.pathname === '/dashboard' ? 'dashboard' : 'financialinfo';

  // Refs for underline
  const dashRef = useRef();
  const userRef = useRef();
  const [hovered, setHovered] = useState(null);
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const ref = (hovered || active) === 'dashboard' ? dashRef : userRef;
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const parentRect = ref.current.parentNode.getBoundingClientRect();
      setUnderline({ left: rect.left - parentRect.left + rect.width * 0.15, width: rect.width * 0.7 });
    }
  }, [active, hovered]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <>
      <Header />
      <div style={{ position: 'fixed', top: 24, right: 32, zIndex: 200 }}>
        <button onClick={toggleTheme} className="theme-switch-btn">
          {theme === 'light' ? <span role="img" aria-label="moon">🌙</span> : <span role="img" aria-label="sun">☀️</span>}
        </button>
      </div>
      <div key={location.pathname} className={`userinfo-root ${theme}-mode`} style={{ minHeight: '100vh', background: 'var(--bg, #f4faff)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', margin: '0 0 32px 0', height: 44, paddingTop: 32 }}>
          <div className="nav-switch-capsule">
            <button
              className={`nav-switch-btn${active === 'dashboard' ? ' nav-switch-active' : ''}`}
              ref={dashRef}
              onClick={() => navigate('/dashboard')}
              onMouseEnter={() => setHovered('dashboard')}
              onMouseLeave={() => setHovered(null)}
            >
              <span>My Projects</span>
            </button>
            <button
              className={`nav-switch-btn${active === 'financialinfo' ? ' nav-switch-active' : ''}`}
              ref={userRef}
              onClick={() => navigate('/financialinfo')}
              onMouseEnter={() => setHovered('financialinfo')}
              onMouseLeave={() => setHovered(null)}
            >
              <span>Financial Info</span>
            </button>
            <div style={{
              position: 'absolute',
              top: 41,
              left: underline.left,
              width: underline.width,
              height: 3,
              background: '#3978f6',
              borderRadius: 2,
              transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1), width 0.25s cubic-bezier(0.4,0,0.2,1)'
            }} />
          </div>
        </div>
        <div style={{padding: 40, textAlign: 'center', maxWidth: 400, margin: '0 auto'}}>
          <div style={{fontSize: '1.15rem', marginBottom: 18, textAlign: 'left'}}><strong>Name:</strong> [User Name]</div>
          <div style={{fontSize: '1.15rem', marginBottom: 18, textAlign: 'left'}}><strong>Phone number:</strong> [User Phone]</div>
        </div>
      </div>
    </>
  );
}

export default UserInfo; 