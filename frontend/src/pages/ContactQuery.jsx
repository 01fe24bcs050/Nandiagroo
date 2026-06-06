import { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../services/api';

export default function ContactQuery() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    query: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await API.post('/api/queries', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', query: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit query');
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
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
          <p className="text-green-100">Have a question? We'd love to hear from you!</p>
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
              <h2 className="text-2xl font-bold text-textPrimary mb-2">Query Submitted!</h2>
              <p className="text-textSecondary mb-6">
                Thank you for contacting us. We'll get back to you soon.
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-darkGreen text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
              >
                Back to Home
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-textPrimary font-semibold mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-darkGreen border-opacity-30 rounded-lg text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-darkGreen"
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-textPrimary font-semibold mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-darkGreen border-opacity-30 rounded-lg text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-darkGreen"
                  placeholder="your@email.com"
                />
              </div>

              {/* Query */}
              <div>
                <label className="block text-textPrimary font-semibold mb-2">Your Query *</label>
                <textarea
                  name="query"
                  value={formData.query}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-darkGreen border-opacity-30 rounded-lg text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-darkGreen resize-none"
                  placeholder="Please describe your query in detail..."
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
                {loading ? 'Submitting...' : 'Submit Query'}
              </button>
            </form>
          )}
        </motion.div>

        {/* Quick Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 grid md:grid-cols-2 gap-6"
        >
          <div className="bg-green-50 p-6 rounded-lg border border-darkGreen border-opacity-20">
            <Mail className="text-darkGreen mb-3" size={24} />
            <h3 className="font-semibold text-textPrimary mb-2">Email Support</h3>
            <p className="text-textSecondary">admin@nandiagro.com</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg border border-darkGreen border-opacity-20">
            <div className="text-darkGreen mb-3 text-2xl">📞</div>
            <h3 className="font-semibold text-textPrimary mb-2">Call Us</h3>
            <p className="text-textSecondary">+91 7795825249</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
