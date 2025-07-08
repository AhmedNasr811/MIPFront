import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import InstallmentCard from '../components/InstallmentCard';
import '../styles/Dashboard.css';


function Dashboard() {
  const { token, logout } = useContext(AuthContext);
  const [installments, setInstallments] = useState([]);

  useEffect(() => {
    const fetchInstallments = async () => {
      try {
        const res = await api.get('/installments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInstallments(res.data);
      } catch (err) {
        alert('Session expired. Please log in again.');
        logout();
      }
    };

    fetchInstallments();
  }, [token, logout]);

  return (
    <div className="dashboard">
      <h2>My Installments</h2>
      {installments.map(inst => (
        <InstallmentCard key={inst.id} data={inst} token={token} refresh={() => {
          // Refresh after payment
          api.get('/installments', {
            headers: { Authorization: `Bearer ${token}` }
          }).then(res => setInstallments(res.data));
        }} />
      ))}
      <button className="logout-button" onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;
