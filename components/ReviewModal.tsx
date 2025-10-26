import React, { useState } from 'react';
import { Product } from '../types';

interface ReviewModalProps {
  product: Product;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

const StarRatingInput: React.FC<{ rating: number; setRating: (rating: number) => void }> = ({ rating, setRating }) => {
  return (
    <div className="flex justify-center text-4xl text-gray-300">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            type="button"
            key={ratingValue}
            className={`cursor-pointer transition-colors ${ratingValue <= rating ? 'text-yellow-400' : 'hover:text-yellow-200'}`}
            onClick={() => setRating(ratingValue)}
          >
            &#9733;
          </button>
        );
      })}
    </div>
  );
};


const ReviewModal: React.FC<ReviewModalProps> = ({ product, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    setError('');
    onSubmit(rating, comment);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md relative animate-fade-in">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center">
            <h2 className="text-2xl font-display font-bold mb-4">Write a review for</h2>
            <img src={product.images[0]} alt={product.name} className="w-24 h-24 object-cover rounded-md mx-auto mb-2" />
            <p className="font-semibold text-gray-800">{product.name}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-center text-sm font-medium text-gray-700 mb-2">Your Rating</label>
            <StarRatingInput rating={rating} setRating={setRating} />
            {error && <p className="text-red-500 text-sm text-center mt-1">{error}</p>}
          </div>

          <div>
             <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Your Review</label>
             <textarea
                id="comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike? What did you use this product for?"
                className="mt-1 w-full p-2 border rounded-md"
             />
          </div>
          <button type="submit" className="w-full btn bg-primary text-white hover:bg-primary-focus font-bold py-3 rounded-full text-lg">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;