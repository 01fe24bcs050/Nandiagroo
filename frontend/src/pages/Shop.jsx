import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/api';

const CATEGORIES = ['Seeds', 'Fertilizers', 'Tools', 'Pesticides', 'Irrigation', 'Other'];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    brand: '',
    search: '',
  });
  const [brands, setBrands] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll(filters);
      setProducts(data);

      const uniqueBrands = [...new Set(data.map(p => p.brand))];
      setBrands(uniqueBrands);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      brand: '',
      search: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-lightGreen mb-2">Shop Products</h1>
        <p className="text-lightGreen opacity-70 text-sm sm:text-base">Browse our premium agricultural products</p>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="flex lg:hidden items-center space-x-3 mb-4">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-sm ${
            showMobileFilters || Object.values(filters).some(f => f !== '')
              ? 'bg-golden text-darkGreen'
              : 'bg-darkGreen bg-opacity-50 text-lightGreen border border-lightGreen border-opacity-20'
          }`}
        >
          <SlidersHorizontal size={18} />
          <span>Filters</span>
          {Object.values(filters).some(f => f !== '') && (
            <span className="w-5 h-5 bg-darkGreen text-golden rounded-full text-xs flex items-center justify-center font-bold">
              {Object.values(filters).filter(f => f !== '').length}
            </span>
          )}
        </button>
        {(filters.search || filters.category || filters.brand || filters.minPrice || filters.maxPrice) && (
          <button
            onClick={handleReset}
            className="text-xs text-golden hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Filters Sidebar - Desktop */}
        <motion.div
          className="hidden lg:block w-64 flex-shrink-0"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="card-premium p-6 rounded-xl space-y-6 sticky top-24">
            {/* Search */}
            <div>
              <label className="block text-lightGreen text-sm font-semibold mb-2">Search</label>
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 bg-darkGreen bg-opacity-30 border border-lightGreen border-opacity-20 rounded-lg text-lightGreen placeholder-lightGreen placeholder-opacity-50 focus:outline-none focus:border-golden text-sm"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-lightGreen text-sm font-semibold mb-3">Category</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={filters.category === cat}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="accent-golden"
                    />
                    <span className="text-lightGreen text-sm">{cat}</span>
                  </label>
                ))}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={filters.category === ''}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="accent-golden"
                  />
                  <span className="text-lightGreen text-sm">All Categories</span>
                </label>
              </div>
            </div>

            {/* Brand */}
            {brands.length > 0 && (
              <div>
                <label className="block text-lightGreen text-sm font-semibold mb-3">Brand</label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full px-3 py-2 bg-darkGreen bg-opacity-30 border border-lightGreen border-opacity-20 rounded-lg text-lightGreen focus:outline-none focus:border-golden text-sm"
                >
                  <option value="">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Price Range */}
            <div>
              <label className="block text-lightGreen text-sm font-semibold mb-3">Price Range</label>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-3 py-2 bg-darkGreen bg-opacity-30 border border-lightGreen border-opacity-20 rounded-lg text-lightGreen placeholder-lightGreen placeholder-opacity-50 focus:outline-none focus:border-golden text-sm"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 bg-darkGreen bg-opacity-30 border border-lightGreen border-opacity-20 rounded-lg text-lightGreen placeholder-lightGreen placeholder-opacity-50 focus:outline-none focus:border-golden text-sm"
                />
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="w-full py-2 border border-golden text-golden rounded-lg hover:bg-golden hover:text-darkGreen transition-all text-sm font-semibold"
            >
              Reset Filters
            </button>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          className="flex-1 min-w-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-golden"></div>
              <p className="text-lightGreen mt-4">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lightGreen text-lg mb-2">No products found</p>
              <p className="text-lightGreen opacity-70 text-sm mb-4">Try adjusting your filters</p>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-golden text-darkGreen rounded-lg font-semibold text-sm"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-lightGreen opacity-70 text-sm mb-4">
                Showing {products.length} product{products.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-60 z-50 lg:hidden"
          onClick={() => setShowMobileFilters(false)}
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed left-0 top-0 h-full w-72 sm:w-80 card-premium p-6 space-y-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lightGreen font-bold text-lg">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-1 text-lightGreen hover:text-golden"
              >
                <X size={24} />
              </button>
            </div>

            <div>
              <label className="block text-lightGreen text-sm font-semibold mb-2">Search</label>
              <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 bg-darkGreen bg-opacity-30 border border-lightGreen border-opacity-20 rounded-lg text-lightGreen text-sm"
              />
            </div>

            <div>
              <label className="block text-lightGreen text-sm font-semibold mb-3">Category</label>
              <div className="space-y-2">
                {CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="mobileCategory"
                      value={cat}
                      checked={filters.category === cat}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="accent-golden"
                    />
                    <span className="text-lightGreen text-sm">{cat}</span>
                  </label>
                ))}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mobileCategory"
                    value=""
                    checked={filters.category === ''}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="accent-golden"
                  />
                  <span className="text-lightGreen text-sm">All Categories</span>
                </label>
              </div>
            </div>

            {brands.length > 0 && (
              <div>
                <label className="block text-lightGreen text-sm font-semibold mb-3">Brand</label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full px-3 py-2 bg-darkGreen bg-opacity-30 border border-lightGreen border-opacity-20 rounded-lg text-lightGreen text-sm"
                >
                  <option value="">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-lightGreen text-sm font-semibold mb-3">Price Range</label>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-3 py-2 bg-darkGreen bg-opacity-30 border border-lightGreen border-opacity-20 rounded-lg text-lightGreen text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 bg-darkGreen bg-opacity-30 border border-lightGreen border-opacity-20 rounded-lg text-lightGreen text-sm"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => {
                  handleReset();
                  setShowMobileFilters(false);
                }}
                className="flex-1 py-2 border border-golden text-golden rounded-lg text-sm font-semibold"
              >
                Reset
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 py-2 bg-golden text-darkGreen rounded-lg text-sm font-semibold"
              >
                Apply
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}