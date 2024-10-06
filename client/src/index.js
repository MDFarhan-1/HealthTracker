import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WalletProvider, ConnectionProvider } from '@aptos-labs/wallet-adapter-react';
// import 'antd/dist/antd.css';
// import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConnectionProvider>
    <WalletProvider>
      <App />
    </WalletProvider>
  </ConnectionProvider>,
  document.getElementById('root')
);
