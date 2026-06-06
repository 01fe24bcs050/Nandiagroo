import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card-premium p-4 rounded-xl overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-darkGreen bg-opacity-50">
        <img
          src={product.imageURL}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-golden text-darkGreen px-3 py-1 rounded-full text-xs font-bold">
          {product.category}
        </div>
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 left-3 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          <Heart
            size={20}
            className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <h3 className="text-textPrimary font-semibold text-sm line-clamp-2">
            {product.name}
          </h3>
          <p className="text-golden text-xs opacity-70">{product.brand}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < (product.rating || 0) ? 'fill-golden text-golden' : 'text-textSecondary opacity-20'}
            />
          ))}
          <span className="text-xs text-textSecondary opacity-70">
            ({product.numReviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex justify-between items-center pt-2 border-t border-darkGreen border-opacity-20">
          <span className="text-golden font-bold text-lg">
            ₹{product.price}
          </span>
          <button
            onClick={handleAddToCart}
            className="p-2 bg-golden text-darkGreen rounded-lg hover:bg-opacity-90 transition-all"
          >
            <ShoppingCart size={18} />
          </button>
        </div>

        {/* Stock Status */}
        <p className={`text-xs font-semibold ${product.quantity > 0 ? 'text-darkGreen' : 'text-red-400'}`}>
          {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
        </p>

        {/* View Details Link */}
        <Link
          to={`/product/${product._id}`}
          className="block w-full text-center py-2 border border-golden text-golden rounded-lg hover:bg-golden hover:text-darkGreen transition-all text-sm font-semibold"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}
