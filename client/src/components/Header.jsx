import React from 'react';
import { Button } from 'antd';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

const Header = () => {
  const { account, connect, disconnect } = useWallet();

  return (
    <header>
      <h1>Habit Tracking App</h1>
      {account ? (
        <>
          <span>{account.address}</span>
          <Button onClick={disconnect}>Disconnect</Button>
        </>
      ) : (
        <Button onClick={connect}>Connect Wallet</Button>
      )}
    </header>
  );
};

export default Header;
