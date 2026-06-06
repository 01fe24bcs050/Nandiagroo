import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const { isAuthenticated } = useAuth();

  const subtotal = getTotalPrice();
  const shipping = subtotal > 0 ? (subtotal > 1000 ? 0 : 100) : 0;
  const tax = subtotal > 0 ? (subtotal * 0.1).toFixed(2) : 0;
  const total = (parseFloat(subtotal) + parseFloat(shipping) + parseFloat(tax)).toFixed(2);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag size={64} className="text-golden mx-auto mb-4 opacity-50" />
          <h2 className="text-3xl font-bold text-lightGreen mb-4">Your cart is empty</h2>
          <p className="text-lightGreen opacity-70 mb-8">
            Add some premium agricultural products to get started!
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 px-8 py-3 bg-golden text-darkGreen rounded-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-lightGreen mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-premium p-4 rounded-lg flex gap-4"
            >
              {/* Product Image */}
              <img
                src={item.imageURL}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
              />

              {/* Product Details */}
              <div className="flex-1">
                <Link
                  to={`/product/${item._id}`}
                  className="text-lightGreen font-semibold hover:text-golden transition-colors block mb-1"
                >
                  {item.name}
                </Link>
                <p className="text-golden text-sm opacity-70 mb-2">{item.brand}</p>
                <p className="text-golden font-bold">₹{item.price}</p>
              </div>

              {/* Quantity & Remove */}
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="p-2 text-red-400 hover:bg-red-400 hover:bg-opacity-10 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>

                <div className="flex items-center border border-lightGreen border-opacity-30 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="px-2 py-1 text-golden hover:bg-golden hover:bg-opacity-10"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-3 py-1 text-lightGreen font-semibold text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="px-2 py-1 text-golden hover:bg-golden hover:bg-opacity-10"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="text-right">
                <p className="text-lightGreen text-sm opacity-70 mb-2">Subtotal</p>
                <p className="text-golden font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </motion.div>
          ))}

          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 text-golden hover:text-lightGreen transition-colors mt-4"
          >
            <span>← Continue Shopping</span>
          </Link>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-premium p-6 rounded-lg h-fit sticky top-24"
        >
          <h2 className="text-lightGreen font-bold text-xl mb-6">Order Summary</h2>

          <div className="space-y-3 mb-6 pb-6 border-b border-lightGreen border-opacity-10">
            <div className="flex justify-between text-lightGreen opacity-70">
              <span>Subtotal ({items.length} items)</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lightGreen opacity-70">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-lightGreen opacity-70">
              <span>Tax (10%)</span>
              <span>₹{tax}</span>
            </div>
          </div>

          <div className="flex justify-between mb-6">
            <span className="text-lightGreen font-semibold text-lg">Total</span>
            <span className="text-golden font-bold text-2xl">₹{total}</span>
          </div>

          {isAuthenticated ? (
            <Link
              to="/checkout"
              className="block w-full py-3 bg-golden text-darkGreen rounded-lg font-semibold hover:bg-opacity-90 transition-all text-center"
            >
              Proceed to Checkout
            </Link>
          ) : (
            <p className="text-center text-lightGreen opacity-70 text-sm mb-4">
              Please login to continue checkout
            </p>
          )}

          <div className="mt-4 pt-4 border-t border-lightGreen border-opacity-10 text-xs text-lightGreen opacity-70 space-y-1">
            <p>✓ Free shipping on orders above ₹1000</p>
            <p>✓ Secure checkout with SSL encryption</p>
            <p>✓ 30-day money-back guarantee</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
