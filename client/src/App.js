import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import WalletConn from './components/WalletConnection'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WalletConn />} />
      </Routes>
    </Router>
  );
}

export default App;
