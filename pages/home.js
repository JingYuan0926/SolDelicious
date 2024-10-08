import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WordPullUp from "../components/magicui/WordPullUp";
import BlurFade from "../components/magicui/BlurFade";
import PulsatingButton from "../components/magicui/PulsatingButton";
import UserOnboardingFlow from '../components/UserOnboardingFlow';
import Particles from "../components/magicui/Particles";
import AIOracleChatbot from '@/components/Chatbot';

const RestaurantCard = ({ name, image, category }) => (
  <div className="bg-white bg-opacity-20 p-4 rounded-lg shadow-lg text-center transform hover:scale-105 transition duration-300">
    <img src={image} alt={name} className="w-full h-48 object-cover rounded-lg mb-4" />
    <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
    <p className="text-sm text-white opacity-75">{category}</p>
  </div>
);

const trendingRestaurants = [
  { name: "The Baking Xperiment", image: "/images/TBX.jpg", category: "Bakery" },
  { name: "Mitasu Japanese", image: "/images/mitasu.jpg", category: "Japanese" },
  { name: "Joe's Western", image: "/images/western.jpg", category: "Western" },
];

const categories = ["All", "Bakery", "Japanese", "Western", "Italian", "Chinese"];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userPreferences, setUserPreferences] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const wallet = useWallet();

  // Load preferences from localStorage when the component mounts
  useEffect(() => {
    const storedPreferences = localStorage.getItem('userPreferences');
    if (storedPreferences) {
      setUserPreferences(JSON.parse(storedPreferences));
    }
  }, []);

  // Handle wallet connection changes
  useEffect(() => {
    if (!wallet.connected && userPreferences) {
      // Wallet was disconnected
      localStorage.removeItem('userPreferences');
      localStorage.removeItem('onboardingComplete');
      setUserPreferences(null);
      setResetKey(resetKey + 1); // Update resetKey to reset onboarding flow
    }
  }, [wallet.connected, userPreferences]);

  // Show onboarding if the user is connected and hasn't completed onboarding
  useEffect(() => {
    if (wallet.connected && !userPreferences && !localStorage.getItem('onboardingComplete')) {
      setShowOnboarding(true);
    }
  }, [wallet.connected, userPreferences]);

  const handleOnboardingComplete = (preferences, spendingRange) => {
    const userData = { preferences, spendingRange };
    setUserPreferences(userData);
    localStorage.setItem('userPreferences', JSON.stringify(userData));
    localStorage.setItem('onboardingComplete', 'true');
    setShowOnboarding(false);
  };

  const filteredRestaurants = trendingRestaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "All" || restaurant.category === selectedCategory)
  );

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <Particles className="absolute inset-0" quantity={100} ease={80} color="#ffffff" />

      <Head>
        <title>JustSOL - Blockchain Food Rating</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <AIOracleChatbot/>
      <main className="flex-grow pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 text-center">
          <WordPullUp
            className="text-6xl font-extrabold text-white mb-8"
            words="JustSOL"
            delay={0}
          />
          <WordPullUp
            className="text-2xl text-white mb-12 animate-pulse"
            words="Truly tasty foods on chain"
            delay={0.3}
          />
          <div className="flex justify-center mb-8">
            <BlurFade delay={0.8} duration={0.5} inView>
              <Link href="/shop">
                <PulsatingButton 
                  className="px-8 py-4 font-bold text-xl rounded-full hover:bg-purple-700 transition duration-300 transform hover:scale-105"
                  pulseColor="rgba(147, 51, 234, 0.5)"
                  duration="2s"
                >
                  Begin Your Order!
                </PulsatingButton>
              </Link>
            </BlurFade>
          </div>

          <BlurFade delay={0.5} duration={0.5} inView>
            {wallet.connected && wallet.publicKey && (
              <p className="text-white mb-4">Connected: {wallet.publicKey.toString().slice(0, 6)}...{wallet.publicKey.toString().slice(-4)}</p>
            )}
          </BlurFade>

          <BlurFade delay={0.2} duration={0.5} inView>
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search restaurants..."
                className="w-full p-2 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </BlurFade>

          <BlurFade delay={0.2} duration={0.5} inView>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === category
                      ? "bg-white text-purple-600"
                      : "bg-purple-600 text-white"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </BlurFade>
        </div>

        <WordPullUp
          className="text-3xl font-bold text-white mb-8 text-center"
          words="Trending Restaurants"
          delay={0.3}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredRestaurants.map((restaurant, idx) => (
            <BlurFade key={restaurant.name} delay={0.25 + idx * 0.1} inView>
              <RestaurantCard 
                name={restaurant.name} 
                image={restaurant.image} 
                category={restaurant.category}
              />
            </BlurFade>
          ))}
        </div>
      </main>

      <Footer />

      <UserOnboardingFlow
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
        resetKey={resetKey}
      />
    </div>
  );
}