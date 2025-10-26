
import React from 'react';

interface RatingProps {
  value: number;
  text?: string;
  color?: string;
}

const Star: React.FC<{ filled: number; color: string }> = ({ filled, color }) => {
  const points = "12,17.27 15.29,21.41 14.1,16.59 18,13.5 13.09,12.81";
  const fullStar = <path d={`${points} 12,2 8.91,12.81 4,13.5 7.9,16.59 6.71,21.41`} />;
  const halfStar = <path d={`M12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z`} />;

  return (
    <svg className={`w-5 h-5 ${color}`} fill="currentColor" viewBox="0 0 24 24">
      {filled === 1 ? fullStar : filled === 0.5 ? halfStar : null}
    </svg>
  );
};

const Rating: React.FC<RatingProps> = ({ value, text, color = 'text-yellow-400' }) => {
  return (
    <div className="flex items-center">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} filled={value >= star ? 1 : value >= star - 0.5 ? 0.5 : 0} color={color} />
        ))}
      </div>
      {text && <span className="ml-2 text-gray-600 text-sm">{text}</span>}
    </div>
  );
};

export default Rating;
