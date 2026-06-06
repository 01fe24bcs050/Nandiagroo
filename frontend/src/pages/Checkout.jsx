import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <p className="text-lightGreen text-lg mb-4">Please login to continue</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-golden text-darkGreen rounded-lg font-semibold"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <p className="text-lightGreen text-lg mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-2 bg-golden text-darkGreen rounded-lg font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const subtotal = getTotalPrice();
  const shipping = subtotal > 1000 ? 0 : 100;
  const tax = (subtotal * 0.1).toFixed(2);
  const total = (parseFloat(subtotal) + shipping + parseFloat(tax)).toFixed(2);

  const handlePlaceOrder = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Validate form data
    const requiredFields = ['shippingAddress', 'city', 'state', 'postalCode', 'phone'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
    }

    const orderData = {
      items: items.map(item => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: `${formData.shippingAddress}, ${formData.city}, ${formData.state} - ${formData.postalCode}`,
      phone: formData.phone,
      itemsPrice: parseFloat(subtotal),
      shippingPrice: shipping,
      taxPrice: parseFloat(tax),
      totalPrice: parseFloat(total),
    };

    const token = localStorage.getItem('token');
    
    // Validate order data before submission
    if (!token) {
      throw new Error('Authentication token missing. Please log in again.');
    }

    if (items.length === 0) {
      throw new Error('Cart is empty. Cannot place order.');
    }

    const response = await orderService.createOrder(orderData, token);

    // Clear cart and navigate
    clearCart();
    navigate('/profile');
  } catch (error) {
    console.error('Order Placement Error:', {
      message: error.message,
      stack: error.stack
    });
    
    // User-friendly error message
    alert(`Order Placement Failed: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  if (orderPlaced) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center card-premium p-12 rounded-2xl max-w-md mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Check size={64} className="text-golden mx-auto" />
          </motion.div>
          <h2 className="text-3xl font-bold text-lightGreen mb-2">Order Placed Successfully!</h2>
          <p className="text-lightGreen opacity-70 mb-6">
            Thank you for your order. You'll be redirected to your profile shortly.
          </p>
          <motion.p
            animate={{ opacity: [0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-golden"
          >
            Redirecting...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/cart')}
        className="flex items-center space-x-2 text-golden hover:text-lightGreen transition-colors mb-8"
      >
        <ArrowLeft size={20} />
        <span>Back to Cart</span>
      </button>

      <h1 className="text-4xl font-bold text-lightGreen mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            {/* Shipping Address */}
            <div className="card-premium p-6 rounded-lg">
              <h2 className="text-lightGreen font-bold text-xl mb-4">Shipping Address</h2>

              <div className="mb-4">
                <label className="block text-lightGreen text-sm font-medium mb-2">
                  Full Address
                </label>
                <input
                  type="text"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  required
                  placeholder="Enter your street address"
                  className="w-full px-4 py-2 bg-darkGreen bg-opacity-30 border border-lightGreen border-opacity-20 rounded-lg text-lightGreen placeholder-lightGreen placeholder-opacity-50 focus:outline-none focus:border-golden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-lightGreen text-sm font-medium mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="City"
                    className="w-full px-4 py-2 bg-darkGreen bg-opacity-30 border border-lightGreen border-opacity-20 rounded-lg text-lightGreen placeholder-lightGreen placeholder-opacity-50 focus:outline-none focus:border-golden"
                  />
                </div>
                <div>
                  <label className="block text-lightGreen text-sm font-medium mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    placeholder="State"
                    className="w-full px-4 py-2 bg-darkGreen bg-opacity-30 border border-lightGreen border-opacity-20 rounded-lg text-lightGreen placeholder-lightGreen placeholder-opacity-50 focus:outline-none focus:border-golden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-lightGreen text-sm font-medium mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    placeholder="Postal Code"
                    className="w-full px-4 py-2 bg-darkGreen bg-opacity-30 border border-lightGreen border-opacity-20 rounded-lg text-lightGreen placeholder-lightGreen placeholder-opacity-50 focus:outline-none focus:border-golden"
                  />
                </div>
                <div>
                  <label className="block text-lightGreen text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Phone"
                    className="w-full px-4 py-2 bg-darkGreen bg-opacity-30 border border-lightGreen border-opacity-20 rounded-lg text-lightGreen placeholder-lightGreen placeholder-opacity-50 focus:outline-none focus:border-golden"
                  />
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="card-premium p-6 rounded-lg">
              <h2 className="text-lightGreen font-bold text-xl mb-4">Order Items</h2>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item._id} className="flex justify-between items-center pb-3 border-b border-lightGreen border-opacity-10">
                    <div>
                      <p className="text-lightGreen font-semibold">{item.name}</p>
                      <p className="text-lightGreen text-sm opacity-70">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-golden font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="card-premium p-6 rounded-lg">
              <h2 className="text-lightGreen font-bold text-xl mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    defaultChecked
                    className="accent-golden"
                  />
                  <span className="text-lightGreen">Cash on Delivery (COD)</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    disabled
                    className="accent-golden opacity-50"
                  />
                  <span className="text-lightGreen opacity-50">Card Payment (Coming Soon)</span>
                </label>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-golden text-darkGreen rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </motion.button>
          </form>
        </motion.div>

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
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lightGreen opacity-70">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between text-lightGreen opacity-70">
              <span>Tax (10%)</span>
              <span>₹{tax}</span>
            </div>
          </div>

          <div className="flex justify-between mb-4">
            <span className="text-lightGreen font-semibold text-lg">Total</span>
            <span className="text-golden font-bold text-2xl">₹{total}</span>
          </div>

          <div className="pt-4 border-t border-lightGreen border-opacity-10 text-xs text-lightGreen opacity-70 space-y-1">
            <p>✓ Secure checkout</p>
            <p>✓ 30-day return policy</p>
            <p>✓ Free shipping on orders above ₹1000</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
