import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../counter/declarations/counter_backend/counter_backend.did.js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MAINNET_IC_URL = "https://ic0.app";
const CANISTER_ID = "6mwkp-fyaaa-aaaag-qm53q-cai"; // Replace with your actual canister ID

const GET_REVIEWS = gql`
  query GetReviews {
    reviewSubmitteds(first: 1000, orderBy: blockTimestamp, orderDirection: desc) {
      id
      user
      rating
      comment
      confidenceScore
    }
  }
`;

const ReviewCard = ({ user, rating, comment, confidenceScore, onLike, onDislike }) => (
  <div className="bg-white p-6 rounded-lg shadow-md mb-4 flex justify-between items-start">
    <div className="flex-grow">
      <div className="flex items-center mb-2">
        <h3 className="text-lg font-semibold mr-2 text-black">{user.slice(0, 6)}...{user.slice(-4)}</h3>
        <div className="flex mr-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={`text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}>
              {star <= rating ? "★" : "☆"}
            </span>
          ))}
        </div>
        <span className="text-sm text-gray-500">Confidence: {confidenceScore}%</span>
      </div>
      <p className="text-gray-600">{comment}</p>
    </div>
    <div className="flex flex-col items-center ml-4">
      <button onClick={onLike} className="mb-2 w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      </button>
      <button onClick={onDislike} className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
        </svg>
      </button>
    </div>
  </div>
);

export default function Reviews() {
  const { loading, error, data, refetch } = useQuery(GET_REVIEWS);
  const [foodRatingActor, setFoodRatingActor] = useState(null);
  const [actorError, setActorError] = useState(null);

  useEffect(() => {
    initActor();
  }, []);

  const initActor = async () => {
    try {
      const agent = new HttpAgent({ host: MAINNET_IC_URL });
      // Note: For production on mainnet, you might not need to fetch the root key
      // await agent.fetchRootKey();
      
      const actor = Actor.createActor(idlFactory, {
        agent,
        canisterId: CANISTER_ID,
      });
      setFoodRatingActor(actor);
    } catch (err) {
      setActorError(`Failed to initialize actor: ${err.message}`);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + parseFloat(review.rating), 0);
    return totalRating / reviews.length;
  };

  const handleRating = async (reviewId, isLike) => {
    try {
      if (!foodRatingActor) throw new Error('Actor not initialized');
      
      const newRating = isLike ? 5 : 1;
      
      // Add the new rating to the existing reviews
      const updatedReviews = [...(data?.reviewSubmitteds || []), { rating: newRating }];
      const averageRating = calculateAverageRating(updatedReviews);
      
      // Update the "Delicious Food" store rating with the precise float64 value
      await foodRatingActor.updateStore("Delicious Food", averageRating);
      
      refetch(); // Refetch the reviews to get the updated data
    } catch (err) {
      setActorError(`Failed to update rating: ${err.message}`);
    }
  };

  // Handle loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const reviews = data?.reviewSubmitteds || [];
  const overallRating = calculateAverageRating(reviews);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-40">
        <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Delicious Food Reviews
          </h1>

          <div className="space-y-6">
            {reviews.map((review) => (
              <ReviewCard 
                key={review.id}
                user={review.user}
                rating={parseFloat(review.rating)}
                comment={review.comment}
                confidenceScore={review.confidenceScore}
                onLike={() => handleRating(review.id, true)}
                onDislike={() => handleRating(review.id, false)}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}