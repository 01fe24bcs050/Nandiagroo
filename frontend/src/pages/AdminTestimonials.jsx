import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { testimonialService } from '../services/api';

export default function AdminTestimonials() {
  const { user, isAuthenticated } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await testimonialService.getAll();
      setTestimonials(response.data);
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchTestimonials();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const handleDelete = async (testimonialId) => {
    if (!window.confirm('Delete this testimonial?')) return;

    try {
      await testimonialService.delete(testimonialId);
      setTestimonials((items) => items.filter((item) => item._id !== testimonialId));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete testimonial');
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-textSecondary text-xl">Admin access required</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golden"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-lightGreen mb-8">Testimonials</h1>

      {testimonials.length === 0 ? (
        <div className="card-premium p-12 rounded-xl text-center">
          <p className="text-lightGreen text-lg">No testimonials found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card-premium p-6 rounded-lg"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-lightGreen font-bold text-lg">{testimonial.name}</h2>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-800 bg-opacity-20 text-gray-900">
                      {testimonial.status}
                    </span>
                  </div>

                  <p className="text-lightGreen opacity-70 text-sm mb-3">
                    {testimonial.email || 'No email'} • {new Date(testimonial.createdAt).toLocaleDateString()}
                  </p>

                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < testimonial.rating ? 'fill-current' : ''}
                        style={{ color: i < testimonial.rating ? 'var(--gold)' : 'var(--text3)' }}
                      />
                    ))}
                  </div>

                  <p className="text-lightGreen">{testimonial.comment}</p>
                </div>

                <button
                  onClick={() => handleDelete(testimonial._id)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-500 bg-opacity-20 border border-red-500 text-red-300 rounded-lg font-semibold hover:bg-opacity-30 transition-all"
                >
                  <Trash2 size={18} />
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
