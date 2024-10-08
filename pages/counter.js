import { useState, useEffect } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../counter/declarations/counter_backend/counter_backend.did.js';

const LOCAL_IC_URL = "http://127.0.0.1:4943";
const CANISTER_ID = "by6od-j4aaa-aaaaa-qaadq-cai";

export default function FoodRating() {
  const [stores, setStores] = useState([]);
  const [error, setError] = useState(null);
  const [foodRatingActor, setFoodRatingActor] = useState(null);
  const [newStore, setNewStore] = useState({ name: '', imageUrl: '' });
  const [updateStore, setUpdateStore] = useState({ name: '', rating: 0 });

  useEffect(() => {
    initActor();
  }, []);

  const initActor = async () => {
    try {
      const agent = new HttpAgent({ host: LOCAL_IC_URL });
      await agent.fetchRootKey();
      
      const actor = Actor.createActor(idlFactory, {
        agent,
        canisterId: CANISTER_ID,
      });
      setFoodRatingActor(actor);
      await fetchAllStores(actor);
    } catch (err) {
      setError(`Failed to initialize actor: ${err.message}`);
    }
  };

  const fetchAllStores = async (actor) => {
    try {
      if (!actor) throw new Error('Actor not initialized');
      const allStores = await actor.getAllStores();
      setStores(allStores);
    } catch (err) {
      setError(`Failed to fetch stores: ${err.message}`);
    }
  };

  const handleCreateStore = async () => {
    try {
      if (!foodRatingActor) throw new Error('Actor not initialized');
      await foodRatingActor.createStore(newStore.name, newStore.imageUrl);
      setNewStore({ name: '', imageUrl: '' });
      await fetchAllStores(foodRatingActor);
    } catch (err) {
      setError(`Failed to create store: ${err.message}`);
    }
  };

  const handleUpdateStore = async () => {
    try {
      if (!foodRatingActor) throw new Error('Actor not initialized');
      await foodRatingActor.updateStore(updateStore.name, Number(updateStore.rating));
      setUpdateStore({ name: '', rating: 0 });
      await fetchAllStores(foodRatingActor);
    } catch (err) {
      setError(`Failed to update store: ${err.message}`);
    }
  };

  const handleDeleteStore = async (name) => {
    try {
      if (!foodRatingActor) throw new Error('Actor not initialized');
      await foodRatingActor.deleteStore(name);
      await fetchAllStores(foodRatingActor);
    } catch (err) {
      setError(`Failed to delete store: ${err.message}`);
    }
  };

  const handleGetStore = async (name) => {
    try {
      if (!foodRatingActor) throw new Error('Actor not initialized');
      const store = await foodRatingActor.getStore(name);
      if (store && store.length > 0) {
        const [storeData] = store;
        alert(`Store: ${storeData.name}, Rating: ${storeData.rating}, Image URL: ${storeData.imageUrl}`);
      } else {
        alert('Store not found');
      }
    } catch (err) {
      setError(`Failed to get store: ${err.message}`);
    }
  };

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Food Rating System</h1>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Create New Store</h2>
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              placeholder="Store Name"
              value={newStore.name}
              onChange={(e) => setNewStore({...newStore, name: e.target.value})}
              className="border p-2"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newStore.imageUrl}
              onChange={(e) => setNewStore({...newStore, imageUrl: e.target.value})}
              className="border p-2"
            />
            <button onClick={handleCreateStore} className="bg-green-500 text-white p-2 rounded">Create Store</button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Update Store</h2>
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              placeholder="Store Name"
              value={updateStore.name}
              onChange={(e) => setUpdateStore({...updateStore, name: e.target.value})}
              className="border p-2"
            />
            <input
              type="number"
              placeholder="New Rating"
              value={updateStore.rating}
              onChange={(e) => setUpdateStore({...updateStore, rating: e.target.value})}
              className="border p-2"
            />
            <button onClick={handleUpdateStore} className="bg-blue-500 text-white p-2 rounded">Update Store</button>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">All Stores</h2>
          <ul className="space-y-2">
            {stores.map((store, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                <span>{store.name} - Rating: {store.rating}</span>
                <div>
                  <button onClick={() => handleGetStore(store.name)} className="bg-yellow-500 text-white p-1 rounded mr-2">Details</button>
                  <button onClick={() => handleDeleteStore(store.name)} className="bg-red-500 text-white p-1 rounded">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}