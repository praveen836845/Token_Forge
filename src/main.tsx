// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { SuiClientProvider, WalletProvider as DappKitWalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import '@mysten/dapp-kit/dist/index.css';
import { WalletProvider } from './WalletContext'; // Import our custom provider

const queryClient = new QueryClient();

const networks = {
  devnet: { url: getFullnodeUrl('devnet') },
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <DappKitWalletProvider autoConnect>
          <WalletProvider> {/* Our custom provider */}
            <BrowserRouter>
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: '#363636',
                    color: '#fff',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                  },
                  success: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 8000,
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  },
                  loading: {
                    duration: Infinity,
                  }
                }}
              />
              <App />
            </BrowserRouter>
          </WalletProvider>
        </DappKitWalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </StrictMode>
);