import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery, gql } from '@apollo/client';
import axios from 'axios';
import Head from 'next/head';

const GET_COMMENTS = gql`
  query GetComments {
    reviewSubmitteds(orderBy: blockTimestamp, orderDirection: desc) {
      comment
    }
  }
`;

const CommentEvaluator = () => {
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiComment, setAiComment] = useState("");

  const { connected } = useWallet();
  const { loading: commentsLoading, error: commentsError, data: commentsData } = useQuery(GET_COMMENTS);

  const generateAIComment = async (reviews) => {
    const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY; // Replace with your actual OpenAI API key
    const prompt = `Read the following restaurant reviews and overall score, then provide a short, insightful summary that captures the main points from all the reviews:

    Reviews:
    ${reviews.join('\n')}

    Summary:`;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a helpful assistant that summarizes restaurant reviews concisely." },
            { role: "user", content: prompt }
          ],
          max_tokens: 150,
          n: 1,
          stop: null,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setAiComment(response.data.choices[0].message.content.trim());
    } catch (error) {
      console.error('Error generating AI comment:', error);
      setAiComment('Unable to generate AI summary at this time.');
    }
  };

  const handleEvaluateReviews = async (e) => {
    e.preventDefault();
    if (loading || commentsLoading || !commentsData) return;

    setLoading(true);
    const reviews = commentsData.reviewSubmitteds.map(item => item.comment);
    console.log("Evaluating reviews:", reviews);

    try {
      // Generate random scores for demonstration
      const randomScore = () => (Math.random() * 4 + 1).toFixed(1);
      const newEvaluation = {
        food: randomScore(),
        price: randomScore(),
        service: randomScore()
      };
      setEvaluation(newEvaluation);

      // Generate AI comment
      await generateAIComment(reviews);
    } catch (error) {
      console.error('Error occurred during evaluation:', error);
      setEvaluation(null);
    } finally {
      setLoading(false);
    }
  };

  const formatScore = (score) => {
    return score === 'N/A' ? 'N/A/5' : `${score}/5`;
  };

  const calculateOverallScore = (evaluation) => {
    if (!evaluation) return 'N/A';
    const scores = Object.values(evaluation).map(score => parseFloat(score));
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return average.toFixed(1);
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-xl">Please connect your Solana wallet to view and evaluate comments.</p>
        </div>
      </div>
    );
  }

  if (commentsLoading) return <div className="text-white text-center">Loading comments...</div>;
  if (commentsError) return <div className="text-red-500 text-center">Error loading comments: {commentsError.message}</div>;

  const reviews = commentsData?.reviewSubmitteds.map(item => item.comment) || [];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <Head>
        <title>Delicious Food - Review Evaluator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex-grow pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-white mb-12 text-center animate-bounce">
          Restaurant Comment Evaluator
        </h1>
  
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-4 mb-8">
            <img
              src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/df/b1/ae/chynna.jpg"
              alt="Delicious Food Restaurant"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Delicious Food</h2>
              <p className="text-gray-600">Restaurant Reviews</p>
            </div>
          </div>
  
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Total Comments</h2>
                <p className="text-4xl font-bold">{reviews.length}</p>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg flex-grow">
                <h2 className="text-xl font-semibold mb-2">Comments</h2>
                {reviews.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2 max-h-[400px] overflow-y-auto">
                    {reviews.map((review, index) => (
                      <li key={index} className="text-gray-700">{review}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No comments available.</p>
                )}
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2">Food Score</h2>
                  <p className="text-3xl font-bold">{formatScore(evaluation?.food || 'N/A')}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2">Price Score</h2>
                  <p className="text-3xl font-bold">{formatScore(evaluation?.price || 'N/A')}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2">Service Score</h2>
                  <p className="text-3xl font-bold">{formatScore(evaluation?.service || 'N/A')}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2">Overall Score</h2>
                  <p className="text-3xl font-bold">{formatScore(evaluation ? calculateOverallScore(evaluation) : 'N/A')}</p>
                </div>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">AI Summary</h2>
                <p className="text-gray-700">{aiComment || "No AI-generated summary available yet."}</p>
              </div>
              
              <button
                onClick={handleEvaluateReviews}
                className={`w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : 'Generate Dashboard'}
              </button>
            </div>
          </div>
        </div>
  
        {commentsError && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {commentsError.message}</span>
          </div>
        )}
      </main>
    </div>
  );
}

export default CommentEvaluator;