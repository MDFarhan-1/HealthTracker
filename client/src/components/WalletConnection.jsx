import React from "react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Provider } from "@aptos-labs/wallet-adapter-react";
import { provider } from "../utils/aptos";

const WalletConnection = () => {
  return (
    <Provider>
      <WalletSelector />
    </Provider>
  );
};

export default WalletConnection;
