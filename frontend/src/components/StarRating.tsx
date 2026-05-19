import React from 'react';
import './StarRating.css';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    onRatingChange?: (rating: number) => void;
    editable?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, maxRating = 5, onRatingChange, editable = false }) => {
    return (
        <div className="star-rating">
            {[...Array(maxRating)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <span
                        key={index}
                        className={`star ${starValue <= rating ? 'filled' : ''} ${editable ? 'editable' : ''}`}
                        onClick={() => editable && onRatingChange && onRatingChange(starValue)}
                    >
                        ★
                    </span>
                );
            })}
        </div>
    );
};

export default StarRating;
