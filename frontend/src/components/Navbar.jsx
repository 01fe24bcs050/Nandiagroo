import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  X,
  ShoppingCart,
  User,
  LogOut,
  LogIn,
  Heart,
  Palette,
} from 'lucide-react';
import { motion } from 'framer-motion';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

import AuthModal from './AuthModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { getTotalWishlistItems } = useWishlist();

  // Check Admin
  const isAdmin = user?.role === 'admin';

  return (
    <>
      <nav className="glass-effect sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link
              to={isAdmin ? '/admin/dashboard' : '/'}
              className="flex items-center space-x-2"
            >
              <div className="text-2xl font-bold text-golden">🌾</div>

              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-textPrimary">
                  NandiAgro
                </h1>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">

              {isAdmin ? (
                <>
                  {/* Admin Links */}
                  <Link
                    to="/admin/dashboard"
                    className="text-textPrimary hover:text-golden transition-colors font-medium"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/admin/orders"
                    className="text-textPrimary hover:text-golden transition-colors font-medium"
                  >
                    Orders
                  </Link>

                  <Link
                    to="/admin/queries"
                    className="text-textPrimary hover:text-golden transition-colors font-medium"
                  >
                    Queries
                  </Link>

                  <Link
                    to="/admin/testimonials"
                    className="text-textPrimary hover:text-golden transition-colors font-medium"
                  >
                    Testimonials
                  </Link>

                  <Link
                    to="/admin/themes"
                    className="text-textPrimary hover:text-golden transition-colors font-medium flex items-center gap-1"
                  >
                    <Palette size={16} />
                    Themes
                  </Link>
                </>
              ) : (
                <>
                  {/* User Links */}
                  <Link
                    to="/"
                    className="text-textPrimary hover:text-golden transition-colors font-medium"
                  >
                    Home
                  </Link>

                  <Link
                    to="/shop"
                    className="text-textPrimary hover:text-golden transition-colors font-medium"
                  >
                    Shop
                  </Link>

                  <Link
                    to="/contact"
                    className="text-textPrimary hover:text-golden transition-colors font-medium"
                  >
                    Contact
                  </Link>

                  <Link
                    to="/testimonials"
                    className="text-textPrimary hover:text-golden transition-colors font-medium"
                  >
                    Testimonials
                  </Link>
                </>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">

              {/* Wishlist */}
              {!isAdmin && (
                <Link
                  to="/wishlist"
                  className="relative p-2 text-textPrimary hover:text-golden transition-colors"
                >
                  <Heart size={24} />

                  {getTotalWishlistItems() > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {getTotalWishlistItems()}
                    </span>
                  )}
                </Link>
              )}

              {/* Cart */}
              {!isAdmin && (
                <Link
                  to="/cart"
                  className="relative p-2 text-textPrimary hover:text-golden transition-colors"
                >
                  <ShoppingCart size={24} />

                  {getTotalItems() > 0 && (
                    <span className="absolute top-0 right-0 bg-golden text-darkGreen text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
              )}

              {/* Authenticated */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">

                  {/* Profile */}
                  {!isAdmin && (
                    <Link
                      to="/profile"
                      className="p-2 text-textPrimary hover:text-golden transition-colors"
                    >
                      <User size={24} />
                    </Link>
                  )}

                  {/* Logout */}
                  <button
                    onClick={logout}
                    className="p-2 text-textPrimary hover:text-golden transition-colors"
                  >
                    <LogOut size={24} />
                  </button>

                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-golden text-darkGreen rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                >
                  <LogIn size={20} />
                  <span>Login</span>
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-textPrimary"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden pb-4 border-t border-darkGreen border-opacity-10"
            >

              {isAdmin ? (
                <>
                  {/* Admin Mobile Menu */}
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 text-textPrimary hover:text-golden transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/admin/orders"
                    className="block px-4 py-2 text-textPrimary hover:text-golden transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Orders
                  </Link>

                  <Link
                    to="/admin/queries"
                    className="block px-4 py-2 text-textPrimary hover:text-golden transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Queries
                  </Link>

                  <Link
                    to="/admin/testimonials"
                    className="block px-4 py-2 text-textPrimary hover:text-golden transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Testimonials
                  </Link>

                  <Link
                    to="/admin/themes"
                    className="block px-4 py-2 text-textPrimary hover:text-golden transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Themes
                  </Link>
                </>
              ) : (
                <>
                  {/* User Mobile Menu */}
                  <Link
                    to="/"
                    className="block px-4 py-2 text-textPrimary hover:text-golden transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>

                  <Link
                    to="/shop"
                    className="block px-4 py-2 text-textPrimary hover:text-golden transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Shop
                  </Link>

                  <Link
                    to="/contact"
                    className="block px-4 py-2 text-textPrimary hover:text-golden transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Contact
                  </Link>

                  <Link
                    to="/testimonials"
                    className="block px-4 py-2 text-textPrimary hover:text-golden transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Testimonials
                  </Link>

                  <Link
                    to="/wishlist"
                    className="block px-4 py-2 text-textPrimary hover:text-golden transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Wishlist
                  </Link>

                  <Link
                    to="/cart"
                    className="block px-4 py-2 text-textPrimary hover:text-golden transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Cart
                  </Link>

                  {isAuthenticated && (
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-textPrimary hover:text-golden transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                  )}
                </>
              )}

              {/* Mobile Login */}
              {!isAuthenticated && (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setIsOpen(false);
                  }}
                  className="w-11/12 mx-4 mt-2 px-4 py-2 bg-golden text-darkGreen rounded-lg font-semibold"
                >
                  Login / Register
                </button>
              )}

            </motion.div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
}
