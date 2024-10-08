import React from 'react';
import Link from 'next/link';
import StarRating from './StarRating';
import BlurFade from '../components/magicui/BlurFade';

const RateRestaurant = ({ restaurant, index }) => {
  const { name, imageUrl, rating } = restaurant;
  
  // Create a URL-friendly slug
  const restaurantSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  // Convert rating to a number and handle potential NaN
  const numericRating = Number(rating);
  const displayRating = !isNaN(numericRating) ? numericRating.toFixed(1) : 'N/A';

  return (
    <BlurFade delay={index * 0.1}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {imageUrl && (
          <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
        )}
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{name}</h2>
          
          {/* Render the star rating */}
          <div className="flex items-center mb-4">
            <StarRating rating={numericRating} />
            <span className="ml-2 text-gray-600">
              {displayRating}/5
            </span>
          </div>

          <div className="flex justify-between">
            <Link href={`/menu/${restaurantSlug}`} passHref>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                Order
              </button>
            </Link>
            <Link href="/reviews" passHref>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
                View Ratings
              </button>
            </Link>
          </div>
        </div>
      </div>
    </BlurFade>
  );
};

export default RateRestaurant;