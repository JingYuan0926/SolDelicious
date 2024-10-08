import React from 'react';

const WordPullUp = ({ className, words, delay = 0 }) => {
  return (
    <div 
      className={`word-pull-up ${className}`} 
      style={{ animationDelay: `${delay}s` }} // Apply delay to the container
    >
      {words.split(' ').map((word, index) => (
        <span key={index} className="word" style={{ animationDelay: `${index * 0.1}s` }}>
          {word}
          {index < words.split(' ').length - 1 && <>&nbsp;</>} {/* Add space between words */}
        </span>
      ))}
      <style jsx>{`
        .word-pull-up {
          overflow: hidden;
          opacity: 0; /* Initially hidden */
          animation: fadeIn 0s forwards; /* Trigger animation after delay */
        }
        .word {
          display: inline-block;
          opacity: 0;
          transform: translateY(2em);
          animation: pullUp 0.8s forwards;
        }
        @keyframes pullUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default WordPullUp;
