// components/StarRating.js
import React from 'react';
import Rating from 'react-rating';
import { Star } from 'lucide-react';

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      <Rating
        initialRating={rating}
        emptySymbol={<Star className="text-gray-300" size={24} />}
        fullSymbol={<Star className="text-yellow-400" size={24} />}
        fractions={2} // Allows half stars
        readonly
      />
    </div>
  );
};

export default StarRating;
