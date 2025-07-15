import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';
import Header from '../components/Header';


function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { email, password });
      alert('Registration successful! Please log in.');
      navigate('/');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <>
      <Header />
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input
          type="email"
          placeholder="Email"
          required
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
        <p>Already have an account? <a href="/">Login</a></p>

      </form>
    </>
  );
}

export default Register;
