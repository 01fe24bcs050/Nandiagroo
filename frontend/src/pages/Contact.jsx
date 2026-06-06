import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', query: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', query: '' });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Failed to submit query:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8" style={{ color: 'var(--text)' }}>Contact Us</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="card-premium p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>Get in Touch</h2>
            <p className="mb-6 text-sm" style={{ color: 'var(--text2)' }}>
              Have a question about our products? We're here to help!
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail size={20} style={{ color: 'var(--green)' }} />
                <span className="text-sm" style={{ color: 'var(--text2)' }}>support@nandiagro.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={20} style={{ color: 'var(--green)' }} />
                <span className="text-sm" style={{ color: 'var(--text2)' }}>+91 7795825249</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={20} style={{ color: 'var(--green)' }} />
                <span className="text-sm" style={{ color: 'var(--text2)' }}>NandiAgro Farms, Karnataka, India</span>
              </div>
            </div>
          </div>

          <div className="card-premium p-6 rounded-xl" style={{ backgroundColor: 'var(--bg)' }}>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text)' }}>Response Time</h3>
            <p className="text-sm" style={{ color: 'var(--text2)' }}>
              We typically respond within 24 hours on business days.
            </p>
          </div>
        </div>

        {/* Query Form */}
        <div className="card-premium p-6 sm:p-8 rounded-xl">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Query Submitted!</h3>
              <p style={{ color: 'var(--text2)' }}>We'll get back to you soon.</p>
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
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text2)' }}>Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field w-full"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text2)' }}>Your Query</label>
                <textarea
                  required
                  value={formData.query}
                  onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                  className="input-field w-full"
                  rows={5}
                  placeholder="Describe your query..."
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
                <span>{submitting ? 'Sending...' : 'Send Query'}</span>
              </motion.button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}