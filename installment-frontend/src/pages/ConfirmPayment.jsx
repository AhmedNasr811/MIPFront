import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import Header from '../components/Header';

function ConfirmPayment({ theme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedDetails = location.state?.selectedDetails || [];
  const [loading, setLoading] = useState(false);

  // Group payments by unit
  const grouped = {};
  let total = 0;
  selectedDetails.forEach(p => {
    if (!grouped[p.unit]) grouped[p.unit] = [];
    grouped[p.unit].push(p);
    total += p.amount;
  });

  const projectName = selectedDetails[0]?.project;

  // Real payment handler (ready for API integration)
  const handlePay = async () => {
    setLoading(true);
    try {
      // Mark as paid in localStorage using the correct key format
      selectedDetails.forEach(p => {
        // Find the paymentIdx for this payment in the project data
        const project = location.state?.projectData;
        let paymentIdx = null;
        if (project) {
          const unit = project.units.find(u => u.name === p.unit);
          if (unit) {
            paymentIdx = unit.payments.findIndex(pay => pay.due === p.due && pay.amount === p.amount);
          }
        }
        if (paymentIdx !== null && paymentIdx !== -1) {
          const paidKey = `paid_${p.project}_${p.unit}_${paymentIdx}`;
          localStorage.setItem(paidKey, '1');
        }
      });
      // TODO: Replace with real API call
      // await api.post('/pay', { payments: selectedDetails });
      await new Promise(res => setTimeout(res, 1200)); // Simulate network delay
      navigate(-1);
    } catch (err) {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className={`dashboard-grid ${theme}-mode`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {projectName && (
          <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '2rem', marginBottom: 24, color: theme === 'dark' ? '#a5d8ff' : '#3978f6' }}>
            {projectName}
          </div>
        )}
        <div className="modal-content" style={{ maxWidth: 480, width: '100%', margin: '0 auto', marginTop: 60 }}>
          <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Confirm Your Payments</h2>
          {selectedDetails.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#3978f6', fontWeight: 500 }}>No payments selected.</div>
          ) : (
            <>
              {Object.entries(grouped).map(([unit, payments]) => (
                <div key={unit} className="unit-section" style={{ marginBottom: 18 }}>
                  <div className="unit-title">{unit}</div>
                  <ul className="unit-payments-list">
                    {payments.map((p, i) => (
                      <li key={i} className="payment-list-item">
                        <span>Amount: {p.amount} EGP</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div style={{ fontWeight: 600, fontSize: '1.15rem', textAlign: 'right', margin: '18px 0 0 0' }}>
                Total: <span style={{ color: '#3978f6' }}>{total} EGP</span>
              </div>
              <button className="pay-all-btn" style={{ width: '100%', marginTop: 18 }} onClick={handlePay} disabled={loading}>
                {loading ? 'Processing...' : 'Pay'}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ConfirmPayment; 