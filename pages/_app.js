import { useState, useEffect, useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { ThemeProvider } from '../components/ThemeProvider';
import { NetworkProvider } from '../components/NetworkContext';
import { NextUIProvider } from "@nextui-org/react";
import Navbar from '../components/Navbar';
import '../styles/globals.css';
import '@solana/wallet-adapter-react-ui/styles.css';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/90400/food/version/latest', // Replace with your actual GraphQL endpoint
  cache: new InMemoryCache()
});

function MyApp({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [], []);

  if (!isClient) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <NetworkProvider>
          <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
              <WalletModalProvider>
                <NextUIProvider>
                  <div className="min-h-screen bg-white dark:bg-dark-background">
                    <Navbar />
                    <Component {...pageProps} />
                  </div>
                </NextUIProvider>
              </WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
        </NetworkProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default MyApp;