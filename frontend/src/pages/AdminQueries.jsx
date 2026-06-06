import { useState, useEffect } from 'react';
import { Mail, CheckCircle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function AdminQueries() {
  const { user, isAuthenticated } = useAuth();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [reply, setReply] = useState('');
  const [updating, setUpdating] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      return;
    }
    fetchQueries();
  }, [isAuthenticated, user]);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/queries');
      setQueries(response.data);
    } catch (error) {
      console.error('Error fetching queries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (queryId) => {
    if (!reply.trim()) {
      alert('Please enter a reply');
      return;
    }

    try {
      setUpdating(true);
      await API.put(`/api/queries/${queryId}`, {
        reply,
        status: 'replied',
      });
      setReply('');
      setSelectedQuery(null);
      fetchQueries();
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkResolved = async (queryId) => {
    try {
      await API.put(`/api/queries/${queryId}`, {
        status: 'resolved',
      });
      fetchQueries();
    } catch (error) {
      console.error('Error marking resolved:', error);
    }
  };

  const handleDelete = async (queryId) => {
    if (window.confirm('Are you sure you want to delete this query?')) {
      try {
        await API.delete(`/api/queries/${queryId}`);
        fetchQueries();
      } catch (error) {
        console.error('Error deleting query:', error);
      }
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-textSecondary text-xl">Admin access required</p>
      </div>
    );
  }

  const filteredQueries =
    filter === 'all'
      ? queries
      : queries.filter((q) => q.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-darkGreen"></div>
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
          <h1 className="text-4xl font-bold mb-2">Customer Queries</h1>
          <p className="text-green-100">Manage and respond to customer inquiries</p>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'pending', 'replied', 'resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                filter === status
                  ? 'bg-darkGreen text-white'
                  : 'bg-gray-200 text-textPrimary hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Queries List */}
        <div className="space-y-4">
          {filteredQueries.length === 0 ? (
            <div className="text-center py-12">
              <Mail size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-textSecondary text-lg">No queries found</p>
            </div>
          ) : (
            filteredQueries.map((query, index) => (
              <motion.div
                key={query._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-darkGreen border-opacity-20 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-textPrimary">{query.name}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          query.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : query.status === 'replied'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {query.status}
                      </span>
                    </div>
                    <p className="text-textSecondary text-sm">{query.email}</p>
                  </div>
                  <div className="flex gap-2">
                    {query.status !== 'resolved' && (
                      <button
                        onClick={() => handleMarkResolved(query._id)}
                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all"
                        title="Mark as resolved"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(query._id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                      title="Delete query"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Query */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-darkGreen">
                  <p className="text-textPrimary">{query.query}</p>
                </div>

                {/* Reply if exists */}
                {query.reply && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <p className="font-semibold text-green-900 mb-1">Your Reply:</p>
                    <p className="text-green-800">{query.reply}</p>
                  </div>
                )}

                {/* Reply Form */}
                {selectedQuery === query._id ? (
                  <div className="space-y-3">
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      className="w-full px-4 py-3 border border-darkGreen border-opacity-30 rounded-lg text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-darkGreen resize-none"
                      rows={4}
                      placeholder="Type your reply here..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReply(query._id)}
                        disabled={updating}
                        className="flex-1 bg-darkGreen text-white py-2 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
                      >
                        {updating ? 'Sending...' : 'Send Reply'}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedQuery(null);
                          setReply('');
                        }}
                        className="px-4 py-2 bg-gray-200 text-textPrimary rounded-lg hover:bg-gray-300 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedQuery(query._id)}
                    className="w-full py-2 border border-darkGreen text-darkGreen rounded-lg hover:bg-darkGreen hover:text-white transition-all"
                  >
                    Reply
                  </button>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
