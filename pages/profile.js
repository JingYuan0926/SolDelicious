import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// GraphQL query
export const GET_USER_ACTIVITY = gql`
  query GetUserActivity {
    preferencesUpdateds(orderBy: blockTimestamp, orderDirection: asc) {
      id
      user
      preferences
      blockTimestamp
    }
    reviewSubmitteds(orderBy: blockTimestamp, orderDirection: asc) {
      id
      user
      rating
      comment
      confidenceScore
      blockTimestamp
    }
  }
`;

// Data processing function
const processUserActivity = (data) => {
  if (!data) return [];

  const activities = [
    ...data.preferencesUpdateds.map(pref => ({
      type: 'preference',
      user: pref.user,
      preferences: pref.preferences.split(','),
      timestamp: parseInt(pref.blockTimestamp)
    })),
    ...data.reviewSubmitteds.map(review => ({
      type: 'review',
      user: review.user,
      rating: parseInt(review.rating),
      comment: review.comment,
      confidenceScore: parseInt(review.confidenceScore),
      timestamp: parseInt(review.blockTimestamp)
    }))
  ];

  // Sort activities by timestamp
  activities.sort((a, b) => a.timestamp - b.timestamp);

  // Group activities by user
  const userActivities = {};
  activities.forEach(activity => {
    if (!userActivities[activity.user]) {
      userActivities[activity.user] = [];
    }
    userActivities[activity.user].push(activity);
  });

  // Create the final timeline
  return Object.entries(userActivities).map(([user, activities]) => ({
    user,
    activities
  }));
};

// Calculation functions
const calculateAverageRating = (activities) => {
  const reviews = activities.filter(a => a.type === 'review');
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
};

const calculateAverageConfidenceScore = (activities) => {
  const reviews = activities.filter(a => a.type === 'review');
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, review) => sum + review.confidenceScore, 0) / reviews.length;
};

// React Component
const UserActivityTimeline = () => {
  const { loading, error, data } = useQuery(GET_USER_ACTIVITY);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
      <p className="text-white text-2xl">Loading...</p>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
      <p className="text-white text-2xl">Error: {error.message}</p>
    </div>
  );

  const timeline = processUserActivity(data);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-40">
        <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            User Profile
          </h1>
          {timeline.map((user, index) => (
            <div key={index} className="mb-8 p-4 bg-gray-100 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">User: {user.user.slice(0, 6)}...{user.user.slice(-4)}</h2>
              <p className="mb-2">Average Rating: {calculateAverageRating(user.activities).toFixed(2)}</p>
              <p className="mb-4">Average Confidence Score: {calculateAverageConfidenceScore(user.activities).toFixed(2)}%</p>
              <div className="space-y-4">
                {user.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="p-3 bg-white rounded shadow">
                    {activity.type === 'preference' ? (
                      <div>
                        <p className="font-semibold">Updated Preferences:</p>
                        <p>{activity.preferences.join(', ')}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold">Submitted Review:</p>
                        <p>Rating: {activity.rating}</p>
                        <p>Confidence Score: {activity.confidenceScore}%</p>
                        <p>Comment: "{activity.comment}"</p>
                      </div>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(activity.timestamp * 1000).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserActivityTimeline;