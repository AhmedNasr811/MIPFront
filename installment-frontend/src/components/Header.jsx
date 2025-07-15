import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Header = () => {
  const navigate = useNavigate();
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 100, width: '100%', background: 'transparent', padding: '16px 0 0 16px', minHeight: 0, pointerEvents: 'none' }}>
      <img
        src={process.env.PUBLIC_URL + '/MIP-bluelogo.png'}
        alt="MIP Logo"
        onClick={() => navigate('/dashboard')}
        className="global-mip-logo"
        style={{ cursor: 'pointer', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.12))', pointerEvents: 'auto' }}
      />
    </div>
  );
};

export default Header; 