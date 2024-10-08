import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-pink-700 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About JustETH</h3>
            <p className="text-sm">Discover and rate restaurants using blockchain technology. Bringing transparency and trust to your dining experiences.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-pink-300 transition duration-300">Home</Link></li>
              <li><Link href="/restaurants" className="hover:text-pink-300 transition duration-300">Restaurants</Link></li>
              <li><Link href="/about" className="hover:text-pink-300 transition duration-300">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-pink-300 transition duration-300">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-pink-300 transition duration-300">Twitter</a>
              <a href="#" className="hover:text-pink-300 transition duration-300">Discord</a>
              <a href="#" className="hover:text-pink-300 transition duration-300">Telegram</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-pink-600 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} JustETH. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;