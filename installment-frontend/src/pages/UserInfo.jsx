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
  const dashSpanRef = useRef();
  const userSpanRef = useRef();
  const [hovered, setHovered] = useState(null);
  const [underline, setUnderline] = useState({ left: 0, width: 0, top: 0 });

  useLayoutEffect(() => {
    const isDash = (hovered || active) === 'dashboard';
    const btnRef = isDash ? dashRef : userRef;
    const spanRef = isDash ? dashSpanRef : userSpanRef;
    const capsule = btnRef.current?.parentNode;
    if (capsule && spanRef.current) {
      const spanRect = spanRef.current.getBoundingClientRect();
      const parentRect = capsule.getBoundingClientRect();
      const offset = hovered ? 18 : 10;
      let left = spanRect.left - parentRect.left;
      if (!hovered && active === 'financialinfo') {
        left -= 10;
      }
      setUnderline({
        left,
        width: spanRect.width,
        top: spanRect.bottom - parentRect.top + offset
      });
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
          <div className="nav-switch-capsule" style={{ position: 'relative', display: 'inline-flex', width: 'auto', minWidth: 0, justifyContent: 'center', alignItems: 'center', padding: '0 8px' }}>
            <button
              className={`nav-switch-btn${active === 'dashboard' ? ' nav-switch-active' : ''}`}
              ref={dashRef}
              onClick={() => navigate('/dashboard')}
              onMouseEnter={() => setHovered('dashboard')}
              onMouseLeave={() => setHovered(null)}
              style={{ padding: '0 24px', overflow: 'visible' }}
            >
              <span ref={dashSpanRef}>My Projects</span>
            </button>
            <button
              className={`nav-switch-btn${active === 'financialinfo' ? ' nav-switch-active' : ''}`}
              ref={userRef}
              onClick={() => navigate('/financialinfo')}
              onMouseEnter={() => setHovered('financialinfo')}
              onMouseLeave={() => setHovered(null)}
              style={{ padding: '0 24px', overflow: 'visible' }}
            >
              <span ref={userSpanRef}>Financial Info</span>
            </button>
            <div style={{
              position: 'absolute',
              left: underline.left,
              top: underline.top,
              width: underline.width,
              height: 3,
              background: '#3978f6',
              borderRadius: 2,
              transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1), width 0.25s cubic-bezier(0.4,0,0.2,1), top 0.25s cubic-bezier(0.4,0,0.2,1)'
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