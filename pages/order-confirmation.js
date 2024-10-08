import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Spinner } from "@nextui-org/spinner";
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

export default function OrderConfirmation() {
  const router = useRouter();
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [evaluation, setEvaluation] = useState(null);
  const [evaluationLoading, setEvaluationLoading] = useState(false);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [error, setError] = useState(null);
  const wallet = useWallet();

  const evaluateReview = async () => {
    if (!review.trim() || evaluationLoading) return;

    setEvaluationLoading(true);
    setEvaluation(null);

    try {
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate a random score based on review length
      const baseScore = Math.min(review.split(' ').length * 2, 100);
      const randomFactor = Math.floor(Math.random() * 50) - 10; // Random number between -10 and 10
      const finalScore = Math.max(0, Math.min(100, baseScore + randomFactor));

      setEvaluation(finalScore);
    } catch (error) {
      console.error('Error occurred during evaluation:', error);
      toast.error('Failed to evaluate review');
    } finally {
      setEvaluationLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (review.trim()) {
        evaluateReview();
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [review]);

  const handleReviewSubmit = async () => {
    if (!wallet.connected) {
      toast.error('Please connect your Solana wallet to submit a review.');
      return;
    }

    setSubmissionLoading(true);
    setError(null);

    try {
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");
      const recipientPublicKey = new PublicKey("EmNte14QTMuQWGrVfqx4Gb3hri632qELgrvLuVn3w12r");

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: recipientPublicKey,
          lamports: 0.01 * LAMPORTS_PER_SOL, // 0.01 SOL as an example fee
        })
      );

      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      console.log('Review submitted successfully:', { rating, review, evaluation });
      console.log('Transaction confirmed:', signature);

      toast.success('Review submitted successfully!', {
        autoClose: 1000,
        onClose: () => router.push('/reviews')
      });
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(`Failed to submit review: ${err.message}`);
      toast.error(`Failed to submit review: ${err.message}`);
    } finally {
      setSubmissionLoading(false);
    }
  };

  const getEvaluationDisplay = () => {
    if (evaluationLoading) {
      return (
        <div className="flex items-center justify-center h-8">
          <Spinner size="md" color="primary" />
        </div>
      );
    }
    if (evaluation === null) {
      return <span className="text-gray-500 text-2xl">-</span>;
    }
    return <span className="text-2xl font-bold text-blue-600">{evaluation}%</span>;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-24 pb-12">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Thank you for your order!</h1>
          <p className="mb-4 text-gray-700">We hope you enjoy your meal. Would you like to leave a review?</p>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="mb-4 p-4 bg-blue-100 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Review Confidence Score:</p>
              <div className="min-w-[60px] flex items-center justify-center">
                {getEvaluationDisplay()}
              </div>
            </div>
          </div>



          <div className="mb-4">
            <label htmlFor="review" className="block text-gray-700 mb-2">Your Review:</label>
            <textarea
              id="review"
              className="w-full p-2 border rounded text-black"
              rows="4"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              disabled={submissionLoading}
              placeholder="Write your review here..."
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Rating:</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  disabled={submissionLoading}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleReviewSubmit}
            className={`w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center ${(submissionLoading || !wallet.connected) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            disabled={submissionLoading || !wallet.connected}
          >
            {submissionLoading ? (
              <>
                <Spinner size="sm" color="white" className="mr-2" />
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </button>
          
        </div>
      </main>

      <ToastContainer position="top-center" />
      <Footer />
    </div>
  );
}