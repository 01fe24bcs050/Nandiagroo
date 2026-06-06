import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send } from 'lucide-react';

export default function TestimonialForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', rating: 5, comment: '' });
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (error) {
      console.error('Failed to submit testimonial:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card-premium p-6 sm:p-8 rounded-xl">
      <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>Share Your Experience</h3>
      
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-6"
        >
          <div className="text-4xl mb-3">✅</div>
          <p className="font-semibold" style={{ color: 'var(--green)' }}>Thank you for your feedback!</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text2)' }}>Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field w-full"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text2)' }}>Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="p-1"
                >
                  <Star
                    size={24}
                    className={star <= formData.rating ? 'fill-current' : ''}
                    style={{ color: star <= formData.rating ? 'var(--gold)' : 'var(--text3)' }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text2)' }}>Your Review</label>
            <textarea
              required
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="input-field w-full"
              rows={4}
              placeholder="Tell us about your experience..."
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            <Send size={18} />
            <span>{submitting ? 'Submitting...' : 'Submit Review'}</span>
          </motion.button>
        </form>
      )}
    </div>
  );
}