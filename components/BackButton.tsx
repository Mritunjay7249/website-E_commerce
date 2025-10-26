import React from 'react';

const BackButton: React.FC = () => {
  // Using window.history.back() and window.history.forward() for more reliable navigation
  // as the useNavigate() hook was reported to work only once.
  const goBack = () => window.history.back();
  const goForward = () => window.history.forward();

  return (
    <div className="flex items-center gap-2 mb-6">
      {/* Back Button */}
      <button
        onClick={goBack}
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
        aria-label="Go back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      {/* Forward Button */}
      <button
        onClick={goForward}
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
        aria-label="Go forward"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default BackButton;
