import React from 'react';
import api from '../api';
import '../styles/InstallmentCard.css';


function InstallmentCard({ data, token, refresh }) {
  const handlePay = async () => {
    try {
      await api.post(`/installments/pay/${data.id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Installment paid!');
      refresh(); // refresh list
    } catch (err) {
      alert('Payment failed');
    }
  };

  return (
    <div className="installment-card" style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
      <p><strong>Amount:</strong> {data.amount}</p>
      <p><strong>Due Date:</strong> {data.dueDate}</p>
      <p><strong>Status:</strong> {data.status}</p>
      {data.status === 'unpaid' && (
        <button className="pay-button" onClick={handlePay}>Pay Now</button>
      )}
    </div>
  );
}

export default InstallmentCard;
