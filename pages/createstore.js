import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../counter/declarations/counter_backend/counter_backend.did.js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Particles from "../components/magicui/Particles";
import WordPullUp from "../components/magicui/WordPullUp";
import BlurFade from "../components/magicui/BlurFade";

const MAINNET_IC_URL = "https://ic0.app";  // Mainnet IC URL
const CANISTER_ID = "6mwkp-fyaaa-aaaag-qm53q-cai";  // Replace with your mainnet canister ID

export default function CreateStore() {
  const [newStore, setNewStore] = useState({ name: '', imageUrl: '' });
  const [foodRatingActor, setFoodRatingActor] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    initActor();
  }, []);

  const initActor = async () => {
    try {
      const agent = new HttpAgent({ host: MAINNET_IC_URL });
      // Remove this for production; this fetchRootKey is for local testing.
      // await agent.fetchRootKey();

      const actor = Actor.createActor(idlFactory, {
        agent,
        canisterId: CANISTER_ID,
      });
      setFoodRatingActor(actor);
    } catch (err) {
      setError(`Failed to initialize actor: ${err.message}`);
    }
  };

  const handleCreateStore = async () => {
    try {
      if (!foodRatingActor) throw new Error('Actor not initialized');
      await foodRatingActor.createStore(newStore.name, newStore.imageUrl);
      setNewStore({ name: '', imageUrl: '' });
      setSuccessMessage('Store created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
    } catch (err) {
      setError(`Failed to create store: ${err.message}`);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <Particles className="absolute inset-0" quantity={100} ease={80} color="#ffffff" />

      <Head>
        <title>Create New Store - JustETH</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="flex-grow pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 text-center">
          <WordPullUp
            className="text-4xl font-extrabold text-white mb-8"
            words="Create New Store"
            delay={0}
          />
          
          <BlurFade delay={0.2} duration={0.5} inView>
            <div className="bg-white bg-opacity-20 p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
              {error && <div className="text-red-500 text-center mb-4">{error}</div>}
              {successMessage && <div className="text-green-500 text-center mb-4">{successMessage}</div>}
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Store Name"
                  value={newStore.name}
                  onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                  className="w-full border p-2 rounded text-black"
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newStore.imageUrl}
                  onChange={(e) => setNewStore({...newStore, imageUrl: e.target.value})}
                  className="w-full border p-2 rounded text-black"
                />
                <button 
                  onClick={handleCreateStore}
                  className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition-colors"
                >
                  Create Store
                </button>
              </div>
            </div>
          </BlurFade>
        </div>
      </main>

      <Footer />
    </div>
  );
}
