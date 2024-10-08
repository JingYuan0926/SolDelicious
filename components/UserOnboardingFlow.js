import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

const cuisineOptions = [
  { name: 'Italian', icon: '🍝' },
  { name: 'Asian', icon: '🍜' },
  { name: 'Mexican', icon: '🌮' },
  { name: 'Mediterranean', icon: '🥙' },
  { name: 'American', icon: '🍔' },
  { name: 'Indian', icon: '🍛' },
  { name: 'Middle Eastern', icon: '🧆' },
  { name: 'Vegetarian/Vegan', icon: '🥗' },
];

const spendingRanges = [
  { label: '$0 - $15 (Budget)', value: 'budget' },
  { label: '$15 - $30 (Moderate)', value: 'moderate' },
  { label: '$30 - $50 (Upscale)', value: 'upscale' },
  { label: '$50+ (Fine Dining)', value: 'fine-dining' },
];

const UserOnboardingFlow = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState([]);
  const [spendingRange, setSpendingRange] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const wallet = useWallet();

  useEffect(() => {
    if (!wallet.connected) {
      setError("Please connect your Solana wallet to continue.");
      console.log("Wallet not connected");
    } else {
      setError(null);
      console.log("Wallet connected:", wallet.publicKey.toString());
    }
  }, [wallet.connected]);

  if (!isOpen) return null;

  const handlePreferenceChange = (cuisine) => {
    setPreferences(prev =>
      prev.includes(cuisine) ? prev.filter(p => p !== cuisine) : [...prev, cuisine]
    );
    console.log("Current preferences:", preferences);
  };

  const handleNext = () => {
    if (preferences.length < 3) {
      setError("Please select at least 3 preferences.");
      return;
    }
    setStep(prev => prev + 1);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!wallet.connected) {
      setError("Please connect your Solana wallet to use this feature.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Here you would typically interact with a Solana program
      // For this example, we'll just simulate a transaction
      const connection = new Connection('https://api.devnet.solana.com');
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey('EmNte14QTMuQWGrVfqx4Gb3hri632qELgrvLuVn3w12r'), // Replace with your program's public key
          lamports: 100000, // Adjust as needed
        })
      );

      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      console.log("Transaction confirmed:", signature);
      console.log("Preferences saved");
      onComplete(preferences, spendingRange);
      onClose();
    } catch (err) {
      console.error("Error saving preferences:", err);
      setError("Failed to save preferences. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-3xl w-full">
        <p className="text-2xl font-bold mb-6 text-black">
          Let's set your food preferences to customize your experience.
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {step === 1 && (
          <>
            <h2 className="text-xl font-bold mb-6 text-black">Choose your food preferences (Select at least 3)</h2>
            <div className="grid grid-cols-4 gap-8 mb-8">
              {cuisineOptions.map(cuisine => (
                <button
                  key={cuisine.name}
                  onClick={() => handlePreferenceChange(cuisine.name)}
                  className={`flex flex-col items-center justify-center p-4 rounded-full transition-all ${preferences.includes(cuisine.name)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-black hover:bg-gray-300'
                    }`}
                >
                  <span className="text-4xl mb-2">{cuisine.icon}</span>
                  <span className="text-sm">{cuisine.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={preferences.length < 3}
              className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-full text-lg font-semibold disabled:opacity-50 hover:bg-purple-700 transition-colors"
            >
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-bold mb-6 text-black">Select your spending range</h2>
            {spendingRanges.map(range => (
              <label key={range.value} className="block mb-4 text-black text-lg">
                <input
                  type="radio"
                  value={range.value}
                  checked={spendingRange === range.value}
                  onChange={(e) => setSpendingRange(e.target.value)}
                  className="mr-3 w-4 h-4"
                />
                {range.label}
              </label>
            ))}
            <button
              onClick={handleSubmit}
              disabled={!spendingRange || isLoading || !wallet.connected}
              className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-full text-lg font-semibold disabled:opacity-50 hover:bg-purple-700 transition-colors"
            >
              {isLoading ? "Saving..." : "Submit"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserOnboardingFlow;