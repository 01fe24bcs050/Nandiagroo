import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsDisplay() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/testimonials');
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2" style={{ color: 'var(--text)' }}>
          What Our Customers Say
        </h2>
        <p className="text-center mb-8" style={{ color: 'var(--text2)' }}>
          Hear from farmers who trust NandiAgro
        </p>

        {testimonials.length === 0 ? (
          <p className="text-center" style={{ color: 'var(--text3)' }}>No reviews yet. Be the first!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((t, index) => (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-premium p-6 rounded-xl relative"
              >
                <Quote size={32} className="absolute top-4 right-4 opacity-10" style={{ color: 'var(--green)' }} />
                
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < t.rating ? 'fill-current' : ''}
                      style={{ color: i < t.rating ? 'var(--gold)' : 'var(--text3)' }}
                    />
                  ))}
                </div>

                <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text2)' }}>
                  "{t.comment}"
                </p>

                <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
                  - {t.name}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}