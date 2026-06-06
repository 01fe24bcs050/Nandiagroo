import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, ArrowLeft, Check, MessageSquare, Edit3 } from 'lucide-react';
import { productService, reviewService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getById(id);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const data = await reviewService.getByProduct(id);
        setReviews(data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleAddToCart = () => {
    if (quantity > 0 && quantity <= (product?.quantity || 0)) {
      addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-golden"></div>
          <p className="text-lightGreen mt-4">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-lightGreen text-lg mb-4">Product not found</p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-2 bg-golden text-darkGreen rounded-lg font-semibold hover:bg-opacity-90"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigate('/shop')}
        className="flex items-center space-x-2 text-golden hover:text-lightGreen transition-colors mb-4 sm:mb-8"
      >
        <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
        <span className="text-sm sm:text-base">Back to Shop</span>
      </motion.button>

      {/* Product Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12"
      >
        {/* Product Image */}
        <div className="card-premium p-4 sm:p-6 rounded-xl overflow-hidden">
          <img
            src={product.imageURL}
            alt={product.name}
            className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg"
          />
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-golden bg-opacity-10 border border-golden border-opacity-30 rounded-lg text-center">
            <p className="text-golden font-semibold text-xs sm:text-sm">{product.category}</p>
          </div>
        </div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Title & Brand */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-lightGreen mb-1 sm:mb-2">{product.name}</h1>
            <p className="text-golden text-base sm:text-lg font-semibold">{product.brand}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`sm:w-[18px] sm:h-[18px] ${i < (product.rating || 0) ? 'fill-golden text-golden' : 'text-lightGreen opacity-20'}`}
                />
              ))}
            </div>
            <span className="text-lightGreen opacity-70 text-sm">({product.numReviews || 0} reviews)</span>
          </div>

          {/* Price */}
          <div className="card-premium p-4 sm:p-6 rounded-lg">
            <p className="text-lightGreen text-xs sm:text-sm opacity-70 mb-1 sm:mb-2">Price</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-golden">₹{product.price}</p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lightGreen font-semibold text-base sm:text-lg mb-1 sm:mb-2">Description</h3>
            <p className="text-lightGreen opacity-80 leading-relaxed text-sm sm:text-base">{product.description}</p>
          </div>

          {/* Stock Status */}
          <div className="card-premium p-3 sm:p-4 rounded-lg">
            <p className={`font-semibold text-base sm:text-lg flex items-center space-x-2 ${product.quantity > 0 ? 'text-lightGreen' : 'text-red-400'}`}>
              {product.quantity > 0 ? (
                <>
                  <Check size={18} className="sm:w-5 sm:h-5" />
                  <span>{product.quantity} in stock</span>
                </>
              ) : (
                <span>Out of stock</span>
              )}
            </p>
          </div>

          {/* Quantity Selector & Add to Cart */}
          {product.quantity > 0 && (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <label className="text-lightGreen font-semibold text-sm sm:text-base">Quantity:</label>
                <div className="flex items-center border border-lightGreen border-opacity-30 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-golden hover:bg-golden hover:bg-opacity-10 text-sm sm:text-base"
                  >
                    −
                  </button>
                  <span className="px-4 sm:px-6 py-1.5 sm:py-2 text-lightGreen font-semibold text-sm sm:text-base">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-golden hover:bg-golden hover:bg-opacity-10 text-sm sm:text-base"
                  >
                    +
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center space-x-2 sm:space-x-3 py-2.5 sm:py-3 bg-golden text-darkGreen rounded-lg font-semibold hover:bg-opacity-90 transition-all text-sm sm:text-base"
              >
                <ShoppingCart size={20} className="sm:w-6 sm:h-6" />
                <span>{addedToCart ? 'Added to Cart!' : 'Add to Cart'}</span>
              </motion.button>

              {addedToCart && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-lightGreen text-xs sm:text-sm"
                >
                  Product added to your cart
                </motion.p>
              )}
            </div>
          )}

          {/* Additional Info */}
          <div className="card-premium p-4 sm:p-6 rounded-lg space-y-2 sm:space-y-3">
            <div>
              <p className="text-lightGreen text-xs sm:text-sm opacity-70">Product ID</p>
              <p className="text-lightGreen font-mono text-xs sm:text-sm break-all">{product._id}</p>
            </div>
            <div className="pt-2 sm:pt-3 border-t border-lightGreen border-opacity-10">
              <p className="text-lightGreen text-xs opacity-70">
                ✓ Quality Assured | ✓ Fast Delivery | ✓ 100% Authentic
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Reviews Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 sm:mt-12"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-lightGreen mb-4 sm:mb-6 flex items-center gap-2">
          <MessageSquare size={24} className="text-golden" />
          Customer Reviews
          <span className="text-sm font-normal text-lightGreen opacity-70">
            ({reviews.length})
          </span>
        </h2>

        {reviewsLoading ? (
          <div className="text-center py-6">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-golden"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="card-premium p-6 sm:p-8 rounded-xl text-center">
            <Star size={40} className="text-golden mx-auto mb-3 opacity-50" />
            <p className="text-lightGreen">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="card-premium p-4 sm:p-6 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-golden bg-opacity-20 flex items-center justify-center">
                      <span className="text-golden font-bold text-sm">
                        {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-lightGreen font-semibold text-sm">
                      {review.user?.name || 'User'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < review.rating ? 'fill-golden text-golden' : 'text-lightGreen opacity-20'}
                        />
                      ))}
                    </div>
                    {review.isEdited && (
                      <span className="flex items-center gap-1 text-xs text-lightGreen opacity-50">
                        <Edit3 size={10} />
                        Edited
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-lightGreen opacity-80 text-sm leading-relaxed">
                  {review.comment}
                </p>
                <p className="text-lightGreen opacity-50 text-xs mt-3">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}