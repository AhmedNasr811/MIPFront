// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Welcome from './pages/Welcome';
import FinancialInfo from './pages/UserInfo';
import ConfirmPayment from './pages/ConfirmPayment';
import ProjectDetails from './pages/ProjectDetails';

function App() {
  // Set default theme to dark, and persist user choice in localStorage
  const getInitialTheme = () => {
    const stored = localStorage.getItem('theme');
    return stored ? stored : 'dark';
  };
  const [theme, setTheme] = useState(getInitialTheme());

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard theme={theme} setTheme={setTheme} />} />
        <Route path="/welcome" element={<Welcome theme={theme} setTheme={setTheme} />} />
        <Route path="/financialinfo" element={<FinancialInfo theme={theme} setTheme={setTheme} />} />
        <Route path="/confirm-payment" element={<ConfirmPayment theme={theme} />} />
        <Route path="/project-details" element={<ProjectDetails theme={theme} setTheme={setTheme} />} />
      </Routes>
    </Router>
  );
}

export default App;

