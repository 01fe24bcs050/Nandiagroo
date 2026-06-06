import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
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
        fetchOrders();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500';
      case 'Processing': return 'bg-blue-500';
      case 'Shipped': return 'bg-purple-500';
      case 'Delivered': return 'bg-green-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-lightGreen mb-8">Admin - Order Management</h1>

      {orders.length === 0 ? (
        <div className="card-premium p-12 rounded-xl text-center">
          <p className="text-lightGreen text-lg">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-premium p-6 rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div>
                  <p className="text-lightGreen text-sm opacity-70">Order ID</p>
                  <p className="text-lightGreen font-mono text-sm">{order._id.slice(-8)}</p>
                </div>

                <div>
                  <p className="text-lightGreen text-sm opacity-70">Customer</p>
                  <p className="text-lightGreen">{order.user?.name || 'Unknown'}</p>
                </div>

                <div>
                  <p className="text-lightGreen text-sm opacity-70">Date</p>
                  <p className="text-lightGreen">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                <div>
                  <p className="text-lightGreen text-sm opacity-70">Total</p>
                  <p className="text-golden font-bold">₹{order.totalPrice?.toFixed(2)}</p>
                </div>

                <div>
                  <p className="text-lightGreen text-sm opacity-70 mb-2">Status</p>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`w-full p-2 rounded-lg text-white font-semibold ${getStatusColor(order.status)}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-lightGreen border-opacity-10">
                <p className="text-lightGreen text-sm opacity-70 mb-2">Order Items:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="text-lightGreen text-sm">
                      • {item.name} × {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}