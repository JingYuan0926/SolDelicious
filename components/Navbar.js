import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConnectWallet } from "@thirdweb-dev/react";
import { useTheme } from './ThemeProvider';
import { Sun, Moon, User } from 'lucide-react'; // import the User icon
import { useRouter } from 'next/router';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Navbar({ isWalletConnected }) {
  const { theme, toggleTheme } = useTheme();
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const opacity = Math.min(scrollPosition / 300, 0.9);
      setScrollOpacity(opacity);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 p-4"
      style={{ 
        backgroundColor: `rgba(219, 39, 119, ${scrollOpacity})`, 
        boxShadow: scrollOpacity > 0 ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/home" className="flex items-center text-2xl font-bold text-white">
              <img src="/images/Solana.png" alt="JustETH Logo" className="h-20 w-20" />
              SolDelicious
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {router.pathname !== '/home' && (
              <Link href="/" className="text-white hover:text-pink-300 transition duration-300">
                Featured Restaurants
              </Link>
            )}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${scrollOpacity > 0.5 ? 'bg-white text-pink-700' : 'bg-pink-700 text-white'} transition duration-300`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <WalletMultiButton />
            <Link href="/profile">
              <button className="flex items-center p-2 rounded-full bg-pink-700 text-white hover:bg-pink-800 transition duration-300">
                <User size={20} /> {/* Using User icon */}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
