import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import Header from '../components/Header';

function ProjectDetails({ theme, setTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const project = location.state?.project;
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [paidStatus, setPaidStatus] = useState({});
  const [collapsedUnits, setCollapsedUnits] = useState({});
  const [hoveredPayment, setHoveredPayment] = useState(null);

  // Helper to get localStorage key
  const getPaymentKey = (projectName, unitName, paymentIdx) =>
    `paid_${projectName}_${unitName}_${paymentIdx}`;

  // On mount, load paid status from localStorage
  useEffect(() => {
    if (!project) return;
    const status = {};
    project.units?.forEach(unit => {
      unit.payments?.forEach((_, idx) => {
        const key = getPaymentKey(project.name, unit.name, idx);
        status[key] = localStorage.getItem(key) === '1';
      });
    });
    setPaidStatus(status);
  }, [project]);

  if (!project) {
    return (
      <div className={`dashboard-grid ${theme}-mode`} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>No project selected</div>
      </div>
    );
  }

  const handlePaymentCheck = (unitName, paymentIdx) => {
    const key = `${unitName}-${paymentIdx}`;
    // Only allow selecting unpaid payments
    const paidKey = getPaymentKey(project.name, unitName, paymentIdx);
    if (paidStatus[paidKey]) return;
    setSelectedPayments(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const handlePaySelected = () => {
    const selectedDetails = [];
    project.units?.forEach(unit => {
      if (unit.payments && unit.payments.length > 0) {
        unit.payments.forEach((p, i) => {
          const key = `${unit.name}-${i}`;
          const paidKey = getPaymentKey(project.name, unit.name, i);
          if (selectedPayments.includes(key) && !paidStatus[paidKey]) {
            selectedDetails.push({
              project: project.name,
              unit: unit.name,
              due: p.due,
              amount: p.amount
            });
          }
        });
      }
    });
    // Redirect to confirmation page with selectedDetails and projectData
    navigate('/confirm-payment', { state: { selectedDetails, projectData: project } });
  };

  const toggleUnit = (unitIdx) => {
    setCollapsedUnits(prev => ({ ...prev, [unitIdx]: !prev[unitIdx] }));
  };

  // Utility to unpay all payments for this project
  const handleUnpayAll = () => {
    project.units?.forEach(unit => {
      unit.payments?.forEach((_, idx) => {
        const key = getPaymentKey(project.name, unit.name, idx);
        localStorage.removeItem(key);
      });
    });
    // Force reload paid status
    const status = {};
    project.units?.forEach(unit => {
      unit.payments?.forEach((_, idx) => {
        const key = getPaymentKey(project.name, unit.name, idx);
        status[key] = false;
      });
    });
    setPaidStatus(status);
  };

  return (
    <>
      <Header />
      <div className={`dashboard-grid ${theme}-mode`} style={{ minHeight: '100vh', padding: '20px', width: '100%' }}>
        <div style={{ width: '100%', maxWidth: 'none', gridColumn: '1/-1' }}>
          <div style={{ textAlign: 'center', fontWeight: 900, fontSize: '2.3rem', marginBottom: 32, color: theme === 'dark' ? '#a5d8ff' : '#3978f6', letterSpacing: '0.01em', fontFamily: 'Inter, Nunito, Arial, sans-serif' }}>
            {project.name}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <button 
              onClick={() => navigate('/dashboard')}
              className="back-btn-modern"
              style={{ marginLeft: 12 }}
            >
              <span style={{ fontSize: '1.2em', display: 'flex', alignItems: 'center' }}>←</span>
              My Projects
            </button>
          </div>

          {project.units && project.units.length > 0 ? (
            <>
              {project.units.map((unit, unitIdx) => {
                // Sort payments: unpaid first, then paid
                const paymentsWithStatus = unit.payments.map((payment, paymentIdx) => {
                  const paidKey = getPaymentKey(project.name, unit.name, paymentIdx);
                  return { ...payment, paymentIdx, paid: paidStatus[paidKey] };
                });
                const unpaid = paymentsWithStatus.filter(p => !p.paid);
                const paid = paymentsWithStatus.filter(p => p.paid);
                const sortedPayments = [...unpaid, ...paid];
                const isCollapsed = collapsedUnits[unitIdx];
                return (
                  <div key={unitIdx} className="unit-section-modern">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0 }}>
                      <span className={`unit-toggle${isCollapsed ? '' : ' open'}`} onClick={() => toggleUnit(unitIdx)} tabIndex={0} role="button" aria-label="Toggle unit section" onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleUnit(unitIdx); }}>
                        ▶
                      </span>
                      <span className="unit-header-modern">{unit.name}</span>
                    </div>
                    {!isCollapsed && (
                      sortedPayments.length > 0 ? (
                        <div style={{ marginTop: 10 }}>
                          <table className="project-table">
                            <thead>
                              <tr>
                                <th style={{ width: '13%', textAlign: 'center' }}>Select</th>
                                <th style={{ width: '27%', textAlign: 'left' }}>Date Due</th>
                                <th style={{ width: '27%', textAlign: 'left' }}>Amount</th>
                                <th style={{ width: '33%', textAlign: 'center' }}>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sortedPayments.map((payment, paymentIdx) => {
                                const key = `${unit.name}-${payment.paymentIdx}`;
                                const isChecked = selectedPayments.includes(key);
                                const paidKey = getPaymentKey(project.name, unit.name, payment.paymentIdx);
                                return (
                                  <tr
                                    key={key}
                                    className={
                                      payment.paid
                                        ? 'paid-row'
                                        : 'unpaid-row' + (hoveredPayment === key ? ' highlighted' : '')
                                    }
                                    aria-checked={isChecked}
                                    role="row"
                                    tabIndex={payment.paid ? -1 : 0}
                                    style={{ cursor: payment.paid ? 'default' : 'pointer' }}
                                    onClick={e => {
                                      if (payment.paid) return;
                                      if (e.target.type !== 'checkbox') {
                                        handlePaymentCheck(unit.name, payment.paymentIdx);
                                      }
                                    }}
                                    onKeyDown={e => {
                                      if (payment.paid) return;
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        handlePaymentCheck(unit.name, payment.paymentIdx);
                                      }
                                    }}
                                    onMouseEnter={() => {
                                      if (!payment.paid) setHoveredPayment(key);
                                    }}
                                    onMouseLeave={() => {
                                      if (!payment.paid) setHoveredPayment(null);
                                    }}
                                  >
                                    <td style={{ textAlign: 'center' }}>
                                      {payment.paid ? (
                                        <span style={{ display: 'inline-block', minWidth: 18 }}></span>
                                      ) : (
                                        <label className="custom-checkbox">
                                          <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => handlePaymentCheck(unit.name, payment.paymentIdx)}
                                            style={{}}
                                            onClick={e => e.stopPropagation()}
                                            tabIndex={-1}
                                            aria-label={`Select payment due ${payment.due} for ${unit.name}`}
                                          />
                                          <span className="checkmark">
                                            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M4 8.5L7 11.5L12 5.5" stroke="#3978f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                          </span>
                                        </label>
                                      )}
                                    </td>
                                    <td style={{ textAlign: 'left' }}>{payment.due}</td>
                                    <td style={{ textAlign: 'left', fontWeight: 600 }}>{payment.amount} EGP</td>
                                    <td style={{ textAlign: 'center' }}>
                                      {payment.paid ? (
                                        <span className="status-badge status-badge-paid">
                                          <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#059669" opacity="0.18"/><path d="M4.5 8.5L7 11L11.5 6.5" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                          Paid
                                        </span>
                                      ) : (
                                        <span className="status-badge status-badge-unpaid">
                                          <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#f59e0b" opacity="0.18"/><path d="M5.5 10.5L10.5 5.5" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                          Unpaid
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div style={{ 
                          textAlign: 'center', 
                          fontSize: '1.1rem', 
                          color: theme === 'dark' ? '#9ca3af' : '#666',
                          padding: '40px 20px'
                        }}>
                          No outstanding payments for this unit.
                        </div>
                      )
                    )}
                  </div>
                );
              })}
              
              {project.units.some(unit => unit.payments && unit.payments.length > 0) && (
                <div style={{ display: 'flex', justifyContent: 'center', width: '35%', margin: '0 auto' }}>
                  <button
                    className="pay-all-btn"
                    style={{ 
                      marginTop: 32, 
                      width: '100%',
                      fontSize: '1.1rem',
                      padding: '8px 0',
                      borderRadius: '999px',
                      boxShadow: '0 4px 16px rgba(57,120,246,0.15)',
                      background: '#3978f6',
                      color: '#fff',
                      border: 'none',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 12,
                      transition: 'background 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#2456b6';
                      e.currentTarget.querySelector('.btn-icon').style.transform = 'translateX(0)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#3978f6';
                      e.currentTarget.querySelector('.btn-icon').style.transform = 'translateX(-16px)';
                    }}
                    disabled={selectedPayments.length === 0}
                    onClick={handlePaySelected}
                  >
                    <span className="btn-icon" style={{
                      display: 'inline-block',
                      transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
                      transform: 'translateX(-16px)'
                    }}>
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="10" rx="3" stroke="#fff" strokeWidth="2"/><path d="M2 10h20" stroke="#fff" strokeWidth="2"/><rect x="6" y="14" width="4" height="2" rx="1" fill="#fff"/></svg>
                    </span>
                    Pay Selected ({selectedPayments.length} payments)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              fontSize: '1.2rem', 
              color: theme === 'dark' ? '#9ca3af' : '#666',
              padding: '40px 20px'
            }}>
              No units available for this project.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProjectDetails; 