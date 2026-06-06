import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Package, ShoppingBag, Users, DollarSign, X } from 'lucide-react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState('products');
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Seeds',
    price: '',
    quantity: '',
    description: '',
    imageURL: '',
    rating: 5,
    numReviews: 0,
  });
  const navigate = useNavigate();

  const monthlySales = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return {
        label: date.toLocaleString('default', { month: 'short' }),
        year: date.getFullYear(),
        month: date.getMonth(),
        sales: 0,
      };
    });

    orders.forEach((order) => {
      const created = new Date(order.createdAt);
      if (Number.isNaN(created.getTime())) return;
      const matching = months.find(
        (item) => item.year === created.getFullYear() && item.month === created.getMonth()
      );
      if (matching) {
        matching.sales += Number(order.totalPrice || 0);
      }
    });

    return months.map((item) => ({ month: item.label, sales: Number(item.sales.toFixed(2)) }));
  }, [orders]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        fetch('http://localhost:5000/api/products'),
        fetch('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      const usersData = await usersRes.json();

      setProducts(productsData);
      setOrders(ordersData);
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: '',
      category: 'Seeds',
      price: '',
      quantity: '',
      description: '',
      imageURL: '',
      rating: 5,
      numReviews: 0,
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand || '',
      category: product.category,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      description: product.description || '',
      imageURL: product.imageURL || '',
      rating: product.rating || 5,
      numReviews: product.numReviews || 0,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingProduct 
        ? `http://localhost:5000/api/products/${editingProduct._id}`
        : 'http://localhost:5000/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
          rating: parseFloat(formData.rating),
          numReviews: parseInt(formData.numReviews),
        }),
      });

      if (response.ok) {
        setShowModal(false);
        fetchData();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchData();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golden"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-lightGreen mb-6 sm:mb-8">Admin Dashboard</h1>

      {/* Mobile Tab Navigation */}
      <div className="flex sm:hidden mb-4 space-x-2 overflow-x-auto">
        {['products', 'orders', 'users'].map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileMenuOpen(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap ${
              mobileMenuOpen === tab
                ? 'bg-golden text-darkGreen'
                : 'bg-darkGreen bg-opacity-50 text-lightGreen'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium p-4 sm:p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lightGreen opacity-70 text-xs sm:text-sm">Products</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-golden mt-1 sm:mt-2">{products.length}</p>
            </div>
            <Package size={24} className="sm:w-10 sm:h-10 text-golden opacity-50" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-premium p-4 sm:p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lightGreen opacity-70 text-xs sm:text-sm">Orders</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-golden mt-1 sm:mt-2">{orders.length}</p>
            </div>
            <ShoppingBag size={24} className="sm:w-10 sm:h-10 text-golden opacity-50" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-premium p-4 sm:p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lightGreen opacity-70 text-xs sm:text-sm">Users</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-golden mt-1 sm:mt-2">{users.length}</p>
            </div>
            <Users size={24} className="sm:w-10 sm:h-10 text-golden opacity-50" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-premium p-4 sm:p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lightGreen opacity-70 text-xs sm:text-sm">Revenue</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-golden mt-1 sm:mt-2">
                ₹{orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0).toFixed(2)}
              </p>
            </div>
            <DollarSign size={24} className="sm:w-10 sm:h-10 text-golden opacity-50" />
          </div>
        </motion.div>
      </div>

      {/* Monthly Sales Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium p-4 sm:p-6 rounded-xl mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <p className="text-lightGreen opacity-70 text-xs sm:text-sm">Sales Overview</p>
            <h2 className="text-xl sm:text-2xl font-bold text-black">Monthly Sales</h2>
          </div>
          <p className="text-golden font-semibold">Last 6 months total: ₹{monthlySales.reduce((sum, item) => sum + item.sales, 0).toFixed(2)}</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlySales} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,197,94,0.15)" />
              <XAxis dataKey="month" tick={{ fill: '#0f766e', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(value) => `₹${value}`} tick={{ fill: '#0f766e', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => [`₹${value.toFixed(2)}`, 'Sales']} cursor={{ stroke: '#10b981', strokeDasharray: '3 3' }} />
              <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#047857' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Products Section - Visible on desktop, toggle on mobile */}
      {(mobileMenuOpen === 'products' || window.innerWidth >= 640) && (
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-lightGreen">Products</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openAddModal}
              className="w-full sm:w-auto px-4 py-2 bg-golden text-darkGreen rounded-lg font-semibold flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <Plus size={20} />
              <span>Add Product</span>
            </motion.button>
          </div>

          {/* Mobile Product Cards */}
          <div className="sm:hidden space-y-3">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-premium p-4 rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lightGreen font-semibold truncate">{product.name}</h3>
                    <p className="text-lightGreen opacity-70 text-xs">{product.category}</p>
                  </div>
                  <div className="flex space-x-2 ml-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-2 bg-blue-500 bg-opacity-20 rounded-lg text-blue-300 hover:bg-opacity-30"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 bg-red-500 bg-opacity-20 rounded-lg text-red-300 hover:bg-opacity-30"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-golden font-bold">₹{product.price.toFixed(2)}</p>
                  <span className={`px-2 py-1 rounded text-xs ${
                    product.quantity > 0 
                      ? 'bg-green-500 bg-opacity-20 text-green-300' 
                      : 'bg-red-500 bg-opacity-20 text-red-300'
                  }`}>
                    {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop Product Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-lightGreen border-opacity-10">
                  <th className="pb-3 text-black opacity-70 text-sm">Name</th>
                  <th className="pb-3 text-black opacity-70 text-sm">Category</th>
                  <th className="pb-3 text-black opacity-70 text-sm">Price</th>
                  <th className="pb-3 text-black opacity-70 text-sm">Stock</th>
                  <th className="pb-3 text-black opacity-70 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-lightGreen border-opacity-5"
                  >
                    <td className="py-3 text-black text-sm">{product.name}</td>
                    <td className="py-3 text-black opacity-70 text-sm">{product.category}</td>
                    <td className="py-3 text-black text-sm">₹{product.price.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        product.quantity > 0 
                          ? 'bg-green-500 bg-opacity-20 text-green-300' 
                          : 'bg-red-500 bg-opacity-20 text-red-300'
                      }`}>
                        {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 bg-blue-500 bg-opacity-20 rounded-lg text-blue-300 hover:bg-opacity-30"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 bg-red-500 bg-opacity-20 rounded-lg text-red-300 hover:bg-opacity-30"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Section - Visible on desktop, toggle on mobile */}
      {(mobileMenuOpen === 'orders' || window.innerWidth >= 640) && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">Recent Orders</h2>
          <div className="space-y-3 sm:space-y-4">
            {orders.slice(0, 5).map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-premium p-3 sm:p-4 rounded-lg"
              >
                {/* Mobile Order Card */}
                <div className="sm:hidden">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-black font-mono text-xs">#{order._id.slice(-8)}</p>
                    <p className="text-golden font-bold text-sm">₹{order.totalPrice?.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-black text-xs opacity-70">{order.user?.name || 'Unknown'}</p>
                    <select
                      value={order.status}
                      onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                      className={`p-1 rounded text-white text-xs font-semibold ${
                        order.status === 'Delivered' ? 'bg-green-500' :
                        order.status === 'Shipped' ? 'bg-purple-500' :
                        order.status === 'Processing' ? 'bg-blue-500' :
                        order.status === 'Cancelled' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Desktop Order Card */}
                <div className="hidden sm:grid grid-cols-5 gap-4 items-center">
                  <div>
                    <p className="text-black text-xs opacity-70">Order</p>
                    <p className="text-black font-mono text-sm">{order._id.slice(-8)}</p>
                  </div>
                  <div>
                    <p className="text-black text-xs opacity-70">Customer</p>
                    <p className="text-black">{order.user?.name || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-black text-xs opacity-70">Total</p>
                    <p className="text-golden font-bold">₹{order.totalPrice?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-black text-xs opacity-70 mb-1">Status</p>
                    <select
                      value={order.status}
                      onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                      className={`w-full p-1 rounded text-white text-xs font-semibold ${
                        order.status === 'Delivered' ? 'bg-green-500' :
                        order.status === 'Shipped' ? 'bg-purple-500' :
                        order.status === 'Processing' ? 'bg-blue-500' :
                        order.status === 'Cancelled' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="text-xs text-black opacity-70">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Users Section - Visible on desktop, toggle on mobile */}
      {(mobileMenuOpen === 'users' || window.innerWidth >= 640) && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">Users</h2>
          
          {/* Mobile User Cards */}
          <div className="sm:hidden space-y-3">
            {users.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-premium p-4 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-black font-semibold">{user.name}</h3>
                    <p className="text-black opacity-70 text-xs">{user.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.role === 'admin'
                      ? 'bg-golden bg-opacity-20 text-golden'
                      : 'bg-blue-500 bg-opacity-20 text-blue-300'
                  }`}>
                    {user.role.toUpperCase()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop User Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-lightGreen border-opacity-10">
                  <th className="pb-3 text-black opacity-70 text-sm">Name</th>
                  <th className="pb-3 text-black opacity-70 text-sm">Email</th>
                  <th className="pb-3 text-black opacity-70 text-sm">Role</th>
                  <th className="pb-3 text-black opacity-70 text-sm">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-lightGreen border-opacity-5"
                  >
                    <td className="py-3 text-black text-sm">{user.name}</td>
                    <td className="py-3 text-black opacity-70 text-sm">{user.email}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.role === 'admin'
                          ? 'bg-golden bg-opacity-20 text-golden'
                          : 'bg-blue-500 bg-opacity-20 text-blue-300'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-black opacity-70 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal - Responsive */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-premium p-4 sm:p-8 rounded-xl w-full max-w-lg mx-4 max-h-screen overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-lightGreen">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-lightGreen hover:text-golden"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-lightGreen text-sm mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 sm:p-3 bg-darkGreen bg-opacity-50 border border-lightGreen border-opacity-20 rounded-lg text-lightGreen text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-lightGreen text-sm mb-1">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full p-2 sm:p-3 bg-darkGreen bg-opacity-50 border border-lightGreen border-opacity-20 rounded-lg text-lightGreen text-sm"
                  />
                </div>
                <div>
                  <label className="block text-lightGreen text-sm mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-2 sm:p-3 bg-darkGreen bg-opacity-50 border border-lightGreen border-opacity-20 rounded-lg text-lightGreen text-sm"
                  >
                    <option value="Seeds">Seeds</option>
                    <option value="Fertilizers">Fertilizers</option>
                    <option value="Tools">Tools</option>
                    <option value="Pesticides">Pesticides</option>
                    <option value="Irrigation">Irrigation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-lightGreen text-sm mb-1">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full p-2 sm:p-3 bg-darkGreen bg-opacity-50 border border-lightGreen border-opacity-20 rounded-lg text-lightGreen text-sm"
                  />
                </div>
                <div>
                  <label className="block text-lightGreen text-sm mb-1">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full p-2 sm:p-3 bg-darkGreen bg-opacity-50 border border-lightGreen border-opacity-20 rounded-lg text-lightGreen text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-lightGreen text-sm mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-2 sm:p-3 bg-darkGreen bg-opacity-50 border border-lightGreen border-opacity-20 rounded-lg text-lightGreen text-sm"
                />
              </div>

              <div>
                <label className="block text-lightGreen text-sm mb-1">Image URL</label>
                <input
                  type="text"
                  name="imageURL"
                  value={formData.imageURL}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-2 sm:p-3 bg-darkGreen bg-opacity-50 border border-lightGreen border-opacity-20 rounded-lg text-lightGreen text-sm"
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full sm:flex-1 py-2 sm:py-3 bg-golden text-darkGreen rounded-lg font-semibold text-sm"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full sm:flex-1 py-2 sm:py-3 bg-red-500 bg-opacity-20 text-red-300 rounded-lg font-semibold text-sm"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}