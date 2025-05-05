// src/contexts/WalletContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';

type WalletContextType = {
  address: string | null;
  isConnected: boolean;
  network: string;
};

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  network: 'testnet',
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const account = useCurrentAccount();
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState('testnet');

  useEffect(() => {
    if (account?.address) {
      setAddress(account.address);
      setIsConnected(true);
      // You can also get the network from account if available
    } else {
      setAddress(null);
      setIsConnected(false);
    }
  }, [account?.address]);

  return (
    <WalletContext.Provider value={{ address, isConnected, network }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);