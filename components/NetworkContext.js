import React, { createContext, useState, useContext } from 'react';

const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
    const [selectedNetwork, setSelectedNetwork] = useState('devnet');

    const getRpcUrl = () => {
        if (selectedNetwork === 'devnet') {
            return process.env.NEXT_PUBLIC_DEVNET_RPC_URL || 'https://api.devnet.solana.com';
        } else {
            return process.env.NEXT_PUBLIC_MAINNET_RPC_URL || 'https://api.mainnet-beta.solana.com';
        }
    };

    return (
        <NetworkContext.Provider value={{ selectedNetwork, setSelectedNetwork, getRpcUrl }}>
            {children}
        </NetworkContext.Provider>
    );
};

export const useNetwork = () => useContext(NetworkContext);