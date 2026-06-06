import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h1 className="text-4xl font-bold text-textPrimary mb-4">Your Wishlist is Empty</h1>
            <p className="text-textSecondary mb-8">
              Start adding your favorite agricultural products to your wishlist!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-darkGreen text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all"
            >
              <ArrowLeft size={20} />
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-darkGreen to-green-500 text-white py-8"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Heart size={32} className="fill-white" />
            <h1 className="text-4xl font-bold">My Wishlist</h1>
          </div>
          <p className="text-green-100">{wishlist.length} item(s) in your wishlist</p>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-darkGreen border-opacity-10 hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img
                  src={product.imageURL}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-golden text-darkGreen px-3 py-1 rounded-full text-xs font-bold">
                  {product.category}
                </div>
              </div>

              {/* Details */}
              <div className="p-4">
                <Link to={`/product/${product._id}`}>
                  <h3 className="font-semibold text-textPrimary mb-1 hover:text-darkGreen transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-golden text-sm mb-2">{product.brand}</p>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-golden">₹{product.price}</span>
                  <span className={`text-sm font-semibold ${product.quantity > 0 ? 'text-darkGreen' : 'text-red-500'}`}>
                    {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {/* Stock Warning */}
                {product.quantity > 0 && product.quantity < 5 && (
                  <p className="text-red-500 text-sm mb-3 font-semibold">⚠️ Only {product.quantity} left!</p>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.quantity === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-darkGreen text-white py-2 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
