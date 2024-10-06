import React, { useEffect, useState } from 'react';

const WellDoneWalletConnect = () => {
  const [userAccount, setUserAccount] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Function to connect to WellDone Wallet
  const connectWellDoneWallet = async () => {
    try {
      if (window.welldone && window.welldone.aptos) {
        // Request the user's account address
        const account = await window.welldone.aptos.connect();
        setUserAccount(account.address);
      } else {
        setErrorMessage('WellDone Wallet is not installed. Please install it from the browser extension store.');
      }
    } catch (error) {
      setErrorMessage('Failed to connect to WellDone Wallet.');
      console.error(error);
    }
  };

  // Function to check if WellDone Wallet is available
  useEffect(() => {
    if (window.welldone && window.welldone.aptos) {
      console.log('WellDone Wallet extension is available.');
    } else {
      setErrorMessage('WellDone Wallet extension not detected.');
    }
  }, []);

  return (
    <div>
      <h2>WellDone Wallet Connect</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {!userAccount ? (
        <button onClick={connectWellDoneWallet}>Connect WellDone Wallet</button>
      ) : (
        <div>
          <p>Connected Account: {userAccount}</p>
        </div>
      )}
    </div>
  );
};

export default WellDoneWalletConnect;
