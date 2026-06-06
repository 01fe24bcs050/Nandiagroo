import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Landing from './pages/Landing';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import AdminOrders from './pages/AdminOrders';
import AdminDashboard from './pages/AdminDashboard';
import ContactQuery from './pages/ContactQuery';
import FAQ from './pages/FAQ';
import Testimonials from './pages/Testimonials';
import Wishlist from './pages/Wishlist';
import ForgotPassword from './pages/ForgotPassword';
import AdminQueries from './pages/AdminQueries';
import AdminTestimonials from './pages/AdminTestimonials';
import AdminTheme from './pages/admin/AdminTheme';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div
                className="min-h-screen flex flex-col"
                style={{ backgroundColor: 'var(--color-bg)' }}
              >
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/contact" element={<ContactQuery />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/testimonials" element={<Testimonials />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/admin/queries" element={<AdminQueries />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/admin/testimonials" element={<AdminTestimonials />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/themes" element={<AdminTheme />} />
                  </Routes>
                </main>
                <Footer />
                <WhatsAppButton />
              </div>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
