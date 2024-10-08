import React from 'react';
import Link from 'next/link';

export default function FoodCard({ name, price, image, restaurantSlug }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-600 mb-4">{price} SOL</p>
        <Link href={`/payment/${restaurantSlug}/${encodeURIComponent(name)}`}>
          <button
            type="button"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Buy
          </button>
        </Link>
      </div>
    </div>
  )
}