import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import PromptABI from './abi/abi.json';

const AIOracleChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize the contract
  useEffect(() => {
    const initContract = async () => {
      try {
        console.log("Initializing contract...");
        const provider = new ethers.providers.JsonRpcProvider('https://opt-sepolia.g.alchemy.com/v2/2iPF_MT9jp-O4mQ0eWd1HpeamV3zWWt4');
        const privateKey = '28f88112e577b6a15dde9fb7868fcd01954f7ccc02c61797d664db7a9a4e0f5a';
        const signer = new ethers.Wallet(privateKey, provider);
        const contractAddress = '0xA29B7532F34f1b76aD9687d761a43Cc0Ee898951';
        const contract = new ethers.Contract(contractAddress, PromptABI.abi, signer);
        setContract(contract);
        console.log("Contract initialized:", contract);
      } catch (error) {
        console.error('Error initializing contract:', error);
      }
    };

    initContract();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (contract) {
      contract.on('foodRecommendation', (requestId, modelId, input, output, callbackData) => {
        console.log('Received foodRecommendation event:', output);
        setMessages(prev => [...prev, { text: output, sender: 'ai' }]);
        setLoading(false);
      });

      return () => {
        contract.removeAllListeners('foodRecommendation');
      };
    }
  }, [contract]);

  // Handle the form submission
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!contract || !input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');
    setLoading(true);
    console.log("User message:", userMessage);

    try {
      const modelId = 11;
      const estimatedFee = await contract.estimateFee(modelId);

      const preferences = {
        cuisineType: "Any",
        mealType: "Any",
        dietaryRestriction: "None",
        mood: userMessage
      };

      const tx = await contract.recommendFood(modelId, preferences, {
        value: estimatedFee,
        gasLimit: ethers.utils.hexlify(3000000),
        gasPrice: ethers.utils.parseUnits('20', 'gwei')
      });

      const receipt = await tx.wait();
      console.log('Transaction confirmed. Receipt:', receipt);

    } catch (error) {
      console.error('Error occurred during transaction:', error);
      setMessages(prev => [...prev, { text: `An error occurred: ${error.message}`, sender: 'ai' }]);
      setLoading(false);
    }
  };

  return (
    <div>
      {/* If the chatbot is not showing, display the crab in the bottom-left corner */}
      {!showChatbot ? (
        <div 
          style={{
            position: 'fixed',
            bottom: '20px', // Distance from the bottom
            left: '20px', // Distance from the left
            zIndex: '1000',
          }}
        >
          {/* Make the image a button */}
          <button 
            onClick={() => setShowChatbot(true)} 
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              zIndex: '1000',
            }}
          >
            <img 
              src="/cartoon.png" 
              alt="Crab character" 
              style={{
                width: '120px', 
                height: '60px',
              }}
            />
          </button>
        </div>
      ) : (
        <div 
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '80px',
            width: '280px',
            height: '300px', // Reduced the height to minimize white space
            backgroundColor: '#ffffff', // White background
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 10,
          }}
        >
          {/* Tail of the speech bubble */}
          <div
            style={{
              position: 'absolute',
              bottom: '-20px',
              right: '20px',
              width: '0',
              height: '0',
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '20px solid #ffffff', // White to match the background
            }}
          ></div>

          <div style={{ position: 'relative', padding: 0, margin: 0 }}>
            <h1 style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', padding: '8px', backgroundColor: '#1e3a8a', color: '#ffffff', margin: 0 }}>Food Recommender</h1>
            
            {/* Close Chat Button in top right */}
            <button
              onClick={() => setShowChatbot(false)}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: '#e3342f',
                color: '#ffffff',
                padding: '6px 10px',
                borderRadius: '50%',
                fontSize: '12px',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              X
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  maxWidth: '70%',
                  padding: '10px',
                  borderRadius: '16px',
                  backgroundColor: message.sender === 'user' ? '#1e3a8a' : '#ffffff',
                  color: message.sender === 'user' ? '#ffffff' : '#000000',
                  alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  fontSize: '14px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                  wordWrap: 'break-word'
                }}
              >
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} style={{ padding: '10px', backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your mood here..."
                style={{
                  flex: 1,
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'border 0.2s ease-in-out',
                  fontSize: '14px'
                }}
                disabled={loading}
              />
              <button
                type="submit"
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1e3a8a',
                  color: '#ffffff',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                  fontSize: '14px'
                }}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIOracleChatbot;