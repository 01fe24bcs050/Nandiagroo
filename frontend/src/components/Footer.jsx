import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass-effect border-t border-darkGreen border-opacity-10 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-3xl">🌾</div>
              <h3 className="text-xl font-bold text-golden">NandiAgro</h3>
            </div>
            <p className="text-textSecondary text-sm opacity-70">
              Premium agricultural products for modern farming
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-textPrimary font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-textSecondary text-sm opacity-70 hover:opacity-100 hover:text-golden transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-textSecondary text-sm opacity-70 hover:opacity-100 hover:text-golden transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-textSecondary text-sm opacity-70 hover:opacity-100 hover:text-golden transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-textSecondary text-sm opacity-70 hover:opacity-100 hover:text-golden transition-colors">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-textPrimary font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-textSecondary text-sm opacity-70 hover:opacity-100 hover:text-golden transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-textSecondary text-sm opacity-70 hover:opacity-100 hover:text-golden transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-textSecondary text-sm opacity-70 hover:opacity-100 hover:text-golden transition-colors">
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-textPrimary font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-textSecondary text-sm opacity-70">
                <Phone size={16} />
                <span>+91 7795825249</span>
              </li>
              <li className="flex items-center space-x-2 text-textSecondary text-sm opacity-70">
                <Mail size={16} />
                <span>admin@nandiagro.com</span>
              </li>
              <li className="flex items-center space-x-2 text-textSecondary text-sm opacity-70">
                <MapPin size={16} />
                <span>Hubli, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-darkGreen border-opacity-10 pt-8 flex justify-between items-center">
          <p className="text-textSecondary text-sm opacity-70">
            © 2024 NandiAgro. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-golden hover:text-textPrimary transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-golden hover:text-textPrimary transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-golden hover:text-textPrimary transition-colors">
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
