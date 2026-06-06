import { useState } from 'react';
import { Star, Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function TestimonialForm() {
  const { isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rating' ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
      setError('');
      setSuccess(false);

    try {
      await API.post('/api/testimonials', formData);
      setSuccess(true);
      setFormData({ rating: 5, comment: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit testimonial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-darkGreen to-green-500 text-white py-12"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">Share Your Experience</h1>
          <p className="text-green-100">Help us improve by sharing your feedback</p>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          {success ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-textPrimary mb-2">Thank You!</h2>
              <p className="text-textSecondary mb-6">
                Your testimonial has been submitted successfully. We appreciate your feedback!
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-darkGreen text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
              >
                Back to Home
              </button>
            </motion.div>
          ) : !isAuthenticated ? (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-textPrimary mb-2">Login Required</h2>
              <p className="text-textSecondary">
                Please login before adding a testimonial.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-textPrimary font-semibold mb-2">Posting As</label>
                <div className="w-full px-4 py-3 border border-darkGreen border-opacity-20 rounded-lg bg-green-50 text-textPrimary">
                  {user?.name} ({user?.email})
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-textPrimary font-semibold mb-2">Rating *</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={`${
                          star <= formData.rating
                            ? 'fill-golden text-golden'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-textPrimary font-semibold mb-2">Your Testimonial *</label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-darkGreen border-opacity-30 rounded-lg text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-darkGreen resize-none"
                  placeholder="Share your experience with NandiAgro..."
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-darkGreen text-white font-semibold py-3 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send size={18} />
                {loading ? 'Submitting...' : 'Submit Testimonial'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
