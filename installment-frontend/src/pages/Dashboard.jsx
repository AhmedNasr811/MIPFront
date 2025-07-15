import React, { useState, useRef, useLayoutEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Dashboard.css';
import Header from '../components/Header';

const currentUserId = 'user1'; // Replace with real user ID from context or token
const mockProjects = [
  {
    name: 'IL BOSCO City (New Cairo)',
    units: [
      {
        name: 'Unit 101',
        userId: 'user1',
        payments: [
          { due: '2024-07-01', amount: 5000 },
          { due: '2024-08-01', amount: 5000 }
        ]
      },
      {
        name: 'Unit 102',
        userId: 'user1',
        payments: [
          { due: '2024-09-01', amount: 4000 }
        ]
      },
      {
        name: 'Unit 103',
        userId: 'user2',
        payments: [
          { due: '2024-10-01', amount: 3500 }
        ]
      }
    ]
  },
  {
    name: 'La Nuova Vista',
    units: [
      {
        name: 'Unit 201',
        userId: 'user1',
        payments: [
          { due: '2024-07-15', amount: 6000 }
        ]
      }
    ]
  },
  {
    name: 'IL BOSCO (New Capital)',
    units: [
      {
        name: 'Unit 301',
        userId: 'user1',
        payments: [
          { due: '2024-09-01', amount: 3000 },
          { due: '2024-10-01', amount: 3500 }
        ]
      },
      {
        name: 'Unit 302',
        userId: 'user1',
        payments: [
          { due: '2024-11-01', amount: 3200 }
        ]
      },
      {
        name: 'Unit 303',
        userId: 'user2',
        payments: [
          { due: '2024-12-01', amount: 3100 }
        ]
      }
    ]
  },
  { name: 'VINCI', units: [] },
  { name: 'KAI SOKHNA', units: [] },
  { name: 'CAN LIMON', units: [] },
  { name: 'SOLARE', units: [] },
  { name: 'CAIRO BUSINESS PARK', units: [] },
  { name: 'VINCI STREET', units: [] },
];

function sortUnits(units) {
  // Units with payments first, then by unit number ascending
  return [...units].sort((a, b) => {
    const aHasPayments = a.payments && a.payments.length > 0;
    const bHasPayments = b.payments && b.payments.length > 0;
    if (aHasPayments !== bHasPayments) {
      return aHasPayments ? -1 : 1;
    }
    // Extract number from unit name (e.g., 'Unit 101' -> 101)
    const aNum = parseInt(a.name.replace(/\D/g, ''));
    const bNum = parseInt(b.name.replace(/\D/g, ''));
    return aNum - bNum;
  });
}

function Dashboard({ theme, setTheme }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [showAllProjects, setShowAllProjects] = useState(false); // DEV: toggle for all projects
  const navigate = useNavigate();
  const location = useLocation();
  const active = location.pathname === '/dashboard' ? 'dashboard' : 'financialinfo';

  // Determine if we should show only 'my projects'
  const showMine = active === 'dashboard' && !showAllProjects;
  const projectsToShow = showMine
    ? mockProjects
        .map(project => ({
          ...project,
          units: (project.units || []).filter(unit => unit.userId === currentUserId)
        }))
        .filter(project => project.units && project.units.length > 0)
    : mockProjects;

  // Refs for underline
  const dashRef = useRef();
  const userRef = useRef();
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  const [selectedPayments, setSelectedPayments] = useState([]);

  useLayoutEffect(() => {
    const ref = (hovered || active) === 'dashboard' ? dashRef : userRef;
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const parentRect = ref.current.parentNode.getBoundingClientRect();
      setUnderline({ left: rect.left - parentRect.left + rect.width * 0.15, width: rect.width * 0.7 });
    }
  }, [active, hovered]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const handlePaymentCheck = (unitName, paymentIdx) => {
    const key = `${unitName}-${paymentIdx}`;
    setSelectedPayments(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const handlePaySelected = () => {
    // Here you would handle the payment logic for selectedPayments
    alert('Paying for: ' + selectedPayments.join(', '));
    setSelectedPayments([]);
  };

  // Handler for toggling between all/my projects
  const handleProjectSwitch = (mine) => {
    if (mine) {
      navigate('/dashboard?mine=1');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <Header />
      <div className={theme + '-mode'} style={{ position: 'fixed', top: 24, right: 32, zIndex: 200 }}>
        <button onClick={toggleTheme} className="theme-switch-btn">
          {theme === 'light' ? <span role="img" aria-label="moon">🌙</span> : <span role="img" aria-label="sun">☀️</span>}
        </button>
      </div>
      <div key={location.pathname} className={`dashboard-grid ${theme}-mode`}>
        {/* Show All Projects Button (always visible) */}
        <div className="project-switch-row" style={{ gridColumn: '1/-1', marginBottom: 8, marginTop: -16 }}>
          <button
            className="theme-switch-btn"
            style={{ padding: '7px 18px', fontSize: '0.98rem', borderRadius: 14, background: showAllProjects ? '#2563eb' : '#3978f6', opacity: 0.85 }}
            onClick={() => setShowAllProjects(v => !v)}
          >
            {showAllProjects ? 'Show Only My Projects' : 'Show All Projects'}
          </button>
        </div>
        {/* Top navigation buttons with sliding underline under text */}
        <div style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', margin: '32px 0 16px 0', height: 'auto' }}>
          <div className="nav-switch-capsule" style={{ marginBottom: 16 }}>
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
        {projectsToShow.map((project, idx) => {
          let imgSrc = '';
          if (project.name === 'IL BOSCO City (New Cairo)') {
            imgSrc = `${process.env.PUBLIC_URL}/ilbosco-newcairo.jpg`;
          } else if (project.name === 'La Nuova Vista') {
            imgSrc = `${process.env.PUBLIC_URL}/la-nuova.jpg`;
          } else if (project.name === 'IL BOSCO (New Capital)') {
            imgSrc = `${process.env.PUBLIC_URL}/ilbosco-newcapital.jpg`;
          } else if (project.name === 'VINCI') {
            imgSrc = `${process.env.PUBLIC_URL}/vinci.jpg`;
          } else if (project.name === 'KAI SOKHNA') {
            imgSrc = `${process.env.PUBLIC_URL}/kai-sokhna.jpg`;
          } else if (project.name === 'CAN LIMON') {
            imgSrc = `${process.env.PUBLIC_URL}/can-limon.jpg`;
          } else if (project.name === 'SOLARE') {
            imgSrc = `${process.env.PUBLIC_URL}/solare.jpg`;
          } else if (project.name === 'CAIRO BUSINESS PARK') {
            imgSrc = `${process.env.PUBLIC_URL}/cbp.jpg`;
          } else if (project.name === 'VINCI STREET') {
            imgSrc = `${process.env.PUBLIC_URL}/vinci-street.jpg`;
          }
          return (
            <div className="dashboard-card" key={idx}>
              {imgSrc && <img src={imgSrc} alt={project.name} className="dashboard-card-img" />}
              <div className="dashboard-card-darken" />
              <img src={process.env.PUBLIC_URL + '/MIP-logo1.png'} alt="MIP Logo" className="dashboard-card-miplogo" />
              <div className="dashboard-card-title">{project.name}</div>
              <button className="view-details-btn" onClick={() => navigate('/project-details', { state: { project } })}>
                <span>View Details</span>
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Dashboard;
