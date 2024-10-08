import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../counter/declarations/counter_backend/counter_backend.did.js';
import RateRestaurant from '../components/RateRestaurant';
import Footer from '../components/Footer';

const LOCAL_IC_URL = "http://127.0.0.1:4943";
const CANISTER_ID = "by6od-j4aaa-aaaaa-qaadq-cai";

export default function RateRestaurants({ isWalletConnected }) {
  const [stores, setStores] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isWalletConnected) {
      initActor();
    }
  }, [isWalletConnected]);

  const initActor = async () => {
    try {
      const agent = new HttpAgent({ host: LOCAL_IC_URL });
      await agent.fetchRootKey();
      
      const actor = Actor.createActor(idlFactory, {
        agent,
        canisterId: CANISTER_ID,
      });
      await fetchAllStores(actor);
    } catch (err) {
      setError(`Failed to initialize actor: ${err.message}`);
    }
  };

  const fetchAllStores = async (actor) => {
    try {
      const allStores = await actor.getAllStores();
      setStores(allStores);
    } catch (err) {
      setError(`Failed to fetch stores: ${err.message}`);
    }
  };

  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-xl">Please connect your wallet to view and rate restaurants.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <Head>
        <title>Web3 Food Rating System - Rate Restaurants</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-grow pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-white mb-12 text-center animate-bounce">
         30% Off on your first order! *T&C Apply
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store, index) => (
            <RateRestaurant key={index} restaurant={store} index={index} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}