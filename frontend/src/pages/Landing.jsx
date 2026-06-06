import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Users, Truck, Award } from 'lucide-react';
import { useEffect, useState } from 'react';

import ProductCard from '../components/ProductCard';
import TestimonialsDisplay from '../components/TestimonialsDisplay';

import { productService } from '../services/api';

export default function Landing() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await productService.getAll();
        setFeaturedProducts(products.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <div className="space-y-12 sm:space-y-16 py-4 sm:py-8">

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="space-y-4 sm:space-y-6 text-center md:text-left"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-textPrimary">Grow Better</span>
              <br />
              <span className="text-golden">With NandiAgro</span>
            </h1>

            <p className="text-textSecondary text-sm sm:text-base lg:text-lg opacity-80 max-w-lg mx-auto md:mx-0">
              Premium agricultural products for modern farmers.
              From seeds to tools, we provide everything you need
              for a successful harvest.
            </p>

            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-golden text-darkGreen rounded-lg font-semibold hover:bg-opacity-90 transition-all hover:scale-105 text-sm sm:text-base"
            >
              <span>Start Shopping</span>
              <ArrowRight size={18} className="sm:w-5 sm:h-5" />
            </Link>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=500&fit=crop"
              alt="Hero"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-darkGreen via-transparent to-transparent opacity-50" />
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
        >
          {[
            {
              icon: Leaf,
              title: 'Organic Products',
              desc: '100% natural and certified',
            },
            {
              icon: Award,
              title: 'Best Quality',
              desc: 'Premium grade products',
            },
            {
              icon: Users,
              title: 'Expert Support',
              desc: '24/7 customer service',
            },
            {
              icon: Truck,
              title: 'Fast Delivery',
              desc: 'Quick & reliable shipping',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="card-premium p-4 sm:p-6 rounded-xl text-center"
            >
              <feature.icon className="w-8 h-8 sm:w-10 sm:h-12 text-golden mx-auto mb-2 sm:mb-4" />

              <h3 className="text-textPrimary font-semibold text-sm sm:text-base mb-1 sm:mb-2">
                {feature.title}
              </h3>

              <p className="text-textSecondary text-xs sm:text-sm opacity-70">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 sm:space-y-8"
        >
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-textPrimary mb-2">
              Featured Products
            </h2>

            <p className="text-textSecondary opacity-70 text-sm sm:text-base">
              Discover our most popular agricultural products
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-golden"></div>

              <p className="text-textSecondary mt-3 sm:mt-4 text-sm">
                Loading products...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center pt-4 sm:pt-8">
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-golden text-darkGreen rounded-lg font-semibold hover:bg-opacity-90 transition-all text-sm sm:text-base"
            >
              <span>View All Products</span>
              <ArrowRight size={18} className="sm:w-5 sm:h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <TestimonialsDisplay />

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="card-premium p-6 sm:p-8 md:p-12 rounded-2xl text-center">

          <h2 className="text-2xl sm:text-3xl font-bold text-lightGreen mb-3 sm:mb-4">
            Ready to Grow Better?
          </h2>

          <p className="text-lightGreen opacity-70 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
            Join thousands of farmers who are already improving
            their harvest with NandiAgro products.
          </p>

          <Link
            to="/shop"
            className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-golden text-darkGreen rounded-lg font-semibold hover:bg-opacity-90 transition-all text-sm sm:text-base"
          >
            Shop Now
          </Link>

        </div>
      </motion.section>

    </div>
  );
}