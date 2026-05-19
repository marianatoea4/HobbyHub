import React, { useState } from 'react';
import StarRating from './StarRating';
import './RatingModal.css';

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    targetType: 'USER' | 'EVENT';
    targetId: number;
    targetLabel: string;
    evaluatorId: number;
    eventId?: number; // Folosit când evaluăm un utilizator în contextul unui eveniment
}

const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, onSuccess, targetType, targetId, targetLabel, evaluatorId, eventId }) => {
    const [score, setScore] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');

        const endpoint = targetType === 'USER' ? '/api/ratings/user' : '/api/ratings/event';
        const url = `http://localhost:8080${endpoint}?userId=${evaluatorId}`;

        const body: any = {
            score,
            comment,
            targetEventId: targetType === 'EVENT' ? targetId : eventId,
            targetUserId: targetType === 'USER' ? targetId : null
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                onSuccess();
                onClose();
            } else {
                const msg = await response.text();
                setError(msg || 'A apărut o eroare la salvarea rating-ului.');
            }
        } catch (err) {
            setError('Eroare de rețea. Încearcă din nou.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="rating-modal-overlay">
            <div className="rating-modal-content">
                <button className="rating-close-btn" onClick={onClose}>&times;</button>
                <h2>Evaluează {targetType === 'USER' ? 'organizatorul' : 'evenimentul'}</h2>
                <p className="rating-target-name">{targetLabel}</p>

                <div className="rating-score-container">
                    <p>Cât de mulțumit ai fost?</p>
                    <StarRating 
                        rating={score} 
                        editable={true} 
                        onRatingChange={(val) => setScore(val)} 
                    />
                </div>

                <div className="rating-comment-container">
                    <p>Lasă un comentariu (opțional):</p>
                    <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Spune-ne mai multe despre experiența ta..."
                    />
                </div>

                {error && <p className="rating-error-msg">{error}</p>}

                <div className="rating-actions">
                    <button className="btn-cancel" onClick={onClose} disabled={isSubmitting}>Anulează</button>
                    <button className="btn-submit" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Se trimite...' : 'Trimite Rating'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RatingModal;
