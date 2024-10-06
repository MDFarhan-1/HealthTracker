import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { WalletProvider, ConnectionProvider } from '@aptos-labs/wallet-adapter-react';
// import 'antd/dist/antd.css';
// import './styles.css';

ReactDOM.render(
  <ConnectionProvider>
    <WalletProvider>
      <App />
    </WalletProvider>
  </ConnectionProvider>,
  document.getElementById('root')
);
