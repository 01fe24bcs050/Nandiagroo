import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  LogOut,
  ShoppingBag,
  Calendar,
  DollarSign,
  XCircle,
  MessageSquare,
  Star,
  Edit3,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { orderService, queryService, reviewService } from '../services/api';

// Order Timeline Component
const OrderTimeline = ({ status }) => {
  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentStep = steps.indexOf(status);

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          {/* Step Circle */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              index <= currentStep
                ? 'bg-golden text-darkGreen'
                : 'bg-gray-600 text-gray-400'
            }`}
          >
            {index + 1}
          </div>

          {/* Step Name */}
          <span
            className={`text-xs ml-1 ${
              index <= currentStep
                ? 'text-golden'
                : 'text-gray-500'
            }`}
          >
            {step}
          </span>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={`w-8 h-0.5 mx-2 ${
                index < currentStep
                  ? 'bg-golden'
                  : 'bg-gray-600'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [myReviews, setMyReviews] = useState([]);
  const [reviewModal, setReviewModal] = useState({
    open: false,
    orderId: null,
    productId: null,
    productName: '',
    reviewId: null,
    rating: 5,
    comment: '',
    isEdit: false,
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Redirect if not authenticated OR if admin
  useEffect(() => {
    // Redirect unauthenticated users
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Redirect admin users
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
      return;
    }

    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [ordersData, queriesResponse, reviewsData] = await Promise.all([
          orderService.getMyOrders(token),
          queryService.getMy(),
          reviewService.getMy(token),
        ]);
        setOrders(ordersData);
        setQueries(queriesResponse.data);
        setMyReviews(reviewsData);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getReviewForProduct = (productId) => {
    return myReviews.find((r) => {
      const reviewProductId = r.product?._id
        ? r.product._id.toString()
        : r.product?.toString?.() || r.product;
      return reviewProductId === productId;
    });
  };

  const openReviewModal = (orderId, productId, productName, existingReview) => {
    setReviewModal({
      open: true,
      orderId,
      productId,
      productName,
      reviewId: existingReview?._id || null,
      rating: existingReview?.rating || 5,
      comment: existingReview?.comment || '',
      isEdit: !!existingReview,
    });
  };

  const closeReviewModal = () => {
    setReviewModal({
      open: false,
      orderId: null,
      productId: null,
      productName: '',
      reviewId: null,
      rating: 5,
      comment: '',
      isEdit: false,
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewModal.comment.trim()) {
      alert('Please write a comment');
      return;
    }
    setSubmittingReview(true);
    try {
      const token = localStorage.getItem('token');
      if (reviewModal.isEdit) {
        await reviewService.update(
          reviewModal.reviewId,
          {
            rating: reviewModal.rating,
            comment: reviewModal.comment.trim(),
          },
          token
        );
      } else {
        await reviewService.create(
          {
            productId: reviewModal.productId,
            orderId: reviewModal.orderId,
            rating: reviewModal.rating,
            comment: reviewModal.comment.trim(),
          },
          token
        );
      }
      const updatedReviews = await reviewService.getMy(token);
      setMyReviews(updatedReviews);
      closeReviewModal();
    } catch (error) {
      alert(error.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Cancel this order? This is allowed only while the order is pending.')) {
      return;
    }

    try {
      setCancellingOrderId(orderId);
      const token = localStorage.getItem('token');
      const data = await orderService.cancelOrder(orderId, token);
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId ? data.order : order
        )
      );
      alert(data.message || 'Order cancelled successfully.');
    } catch (error) {
      alert(error.message || 'Failed to cancel order');
    } finally {
      setCancellingOrderId(null);
    }
  };

  if (!isAuthenticated || user?.role === 'admin') {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium p-8 rounded-xl mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            <div className="w-20 h-20 bg-golden bg-opacity-20 rounded-full flex items-center justify-center">
              <User size={40} className="text-golden" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-lightGreen mb-2">
                {user?.name}
              </h1>

              <div className="flex items-center space-x-2 text-lightGreen opacity-70">
                <Mail size={16} />
                <span>{user?.email}</span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500 bg-opacity-20 border border-red-500 text-red-300 rounded-lg font-semibold hover:bg-opacity-30 transition-all flex items-center space-x-2"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Queries Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-lightGreen mb-6">
          My Queries
        </h2>

        {loading ? (
          <div className="text-center py-6">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-golden"></div>
          </div>
        ) : queries.length === 0 ? (
          <div className="card-premium p-8 rounded-xl text-center">
            <MessageSquare size={40} className="text-golden mx-auto mb-3 opacity-60" />
            <p className="text-lightGreen">No queries submitted yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {queries.map((query) => (
              <div key={query._id} className="card-premium p-6 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div>
                    <p className="text-lightGreen font-semibold">{query.query}</p>
                    <p className="text-lightGreen opacity-70 text-xs mt-1">
                      Submitted on {new Date(query.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold self-start ${
                    query.status === 'pending'
                      ? 'bg-yellow-500 bg-opacity-20 text-yellow-300'
                      : query.status === 'replied'
                      ? 'bg-blue-500 bg-opacity-20 text-blue-300'
                      : 'bg-green-500 bg-opacity-20 text-green-300'
                  }`}>
                    {query.status.toUpperCase()}
                  </span>
                </div>

                {query.reply ? (
                  <div className="mt-4 p-4 bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 rounded-lg">
                    <p className="text-lightGreen opacity-70 text-sm mb-1">Admin Reply</p>
                    <p className="text-lightGreen">{query.reply}</p>
                  </div>
                ) : (
                  <p className="text-lightGreen opacity-70 text-sm">
                    We have not replied to this query yet.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Orders Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-lightGreen mb-6">
          My Orders
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-golden"></div>

            <p className="text-lightGreen mt-4">
              Loading orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="card-premium p-12 rounded-xl text-center">
            <ShoppingBag
              size={48}
              className="text-golden mx-auto mb-4 opacity-50"
            />

            <p className="text-lightGreen text-lg mb-4">
              No orders yet
            </p>

            <p className="text-lightGreen opacity-70 mb-6">
              Start shopping to see your orders here!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-premium p-6 rounded-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  {/* Order ID */}
                  <div>
                    <p className="text-lightGreen text-sm opacity-70 mb-1">
                      Order ID
                    </p>

                    <p className="text-lightGreen font-mono text-sm break-all">
                      {order._id}
                    </p>
                  </div>

                  {/* Date */}
                  <div>
                    <p className="text-lightGreen text-sm opacity-70 mb-1 flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>Date</span>
                    </p>

                    <p className="text-lightGreen font-semibold">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Items Count */}
                  <div>
                    <p className="text-lightGreen text-sm opacity-70 mb-1 flex items-center space-x-1">
                      <ShoppingBag size={14} />
                      <span>Items</span>
                    </p>

                    <p className="text-lightGreen font-semibold">
                      {order.orderItems
                        ? order.orderItems.length
                        : 0}{' '}
                      item(s)
                    </p>
                  </div>

                  {/* Total */}
                  <div>
                    <p className="text-lightGreen text-sm opacity-70 mb-1 flex items-center space-x-1">
                      <DollarSign size={14} />
                      <span>Total</span>
                    </p>

                    <p className="text-golden font-bold">
                      ₹{order.totalPrice?.toFixed(2) || 0}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="text-center">
                    <span
                      className={`px-4 py-2 rounded-full font-semibold text-sm ${
                        order.status === 'Delivered'
                          ? 'bg-green-500 bg-opacity-20 text-green-300'
                          : order.status === 'Pending'
                          ? 'bg-yellow-500 bg-opacity-20 text-yellow-300'
                          : order.status === 'Processing'
                          ? 'bg-blue-500 bg-opacity-20 text-blue-300'
                          : order.status === 'Cancelled'
                          ? 'bg-red-500 bg-opacity-20 text-red-300'
                          : 'bg-purple-500 bg-opacity-20 text-purple-300'
                      }`}
                    >
                      {order.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </div>

                  {/* Timeline */}
                  <div className="md:col-span-5">
                    <OrderTimeline
                      status={order.status || 'Pending'}
                    />
                  </div>

                  <div className="md:col-span-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    {order.status === 'Pending' ? (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingOrderId === order._id}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-500 bg-opacity-20 border border-red-500 text-red-300 rounded-lg font-semibold hover:bg-opacity-30 transition-all disabled:opacity-50"
                      >
                        <XCircle size={18} />
                        <span>
                          {cancellingOrderId === order._id ? 'Cancelling...' : 'Cancel Order'}
                        </span>
                      </button>
                    ) : order.status === 'Processing' ? (
                      <p className="text-lightGreen opacity-70 text-sm">
                        This order is processing and can no longer be cancelled.
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Order Details */}
                <div className="mt-4 pt-4 border-t border-lightGreen border-opacity-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {/* Shipping */}
                    <div>
                      <p className="text-lightGreen opacity-70">
                        Shipping Address
                      </p>

                      <p className="text-lightGreen mt-1">
                        {order.shippingAddress
                          ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`
                          : 'Address not available'}
                      </p>
                    </div>

                    {/* Items */}
                    <div>
                      <p className="text-lightGreen opacity-70">
                        Items
                      </p>

                      <div className="mt-1 space-y-2">
                        {order.orderItems &&
                          order.orderItems.map((item) => {
                            const review =
                              order.status === 'Delivered'
                                ? getReviewForProduct(item.product)
                                : null;
                            return (
                              <div
                                key={item.product}
                                className="flex items-center justify-between"
                              >
                                <Link
                                  to={`/product/${item.product}`}
                                  className="text-lightGreen hover:text-golden hover:underline transition-colors"
                                >
                                  • {item.name} - {item.quantity}x @ ₹
                                  {item.price}
                                </Link>
                                {order.status === 'Delivered' && (
                                  <>
                                    {review ? (
                                      review.isEdited ? (
                                        <span className="flex items-center gap-1 text-xs text-green-400 ml-2 shrink-0">
                                          <CheckCircle size={12} /> Reviewed
                                        </span>
                                      ) : (
                                        <button
                                          onClick={() =>
                                            openReviewModal(
                                              order._id,
                                              item.product,
                                              item.name,
                                              review
                                            )
                                          }
                                          className="flex items-center gap-1 text-xs text-golden hover:underline ml-2 shrink-0"
                                        >
                                          <Edit3 size={12} /> Edit Review
                                        </button>
                                      )
                                    ) : (
                                      <button
                                        onClick={() =>
                                          openReviewModal(
                                            order._id,
                                            item.product,
                                            item.name,
                                            null
                                          )
                                        }
                                        className="flex items-center gap-1 text-xs text-golden hover:underline ml-2 shrink-0"
                                      >
                                        <Star size={12} /> Write Review
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div>
                      <p className="text-lightGreen opacity-70 mb-2">
                        Breakdown
                      </p>

                      <div className="text-lightGreen text-xs space-y-1">
                        <p>
                          Subtotal: ₹
                          {order.itemsPrice?.toFixed(2) || 0}
                        </p>

                        <p>
                          Shipping:{' '}
                          {order.shippingPrice === 0
                            ? 'FREE'
                            : `₹${order.shippingPrice?.toFixed(2)}`}
                        </p>

                        <p>
                          Tax: ₹
                          {order.taxPrice?.toFixed(2) || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Review Modal */}
      {reviewModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card-premium p-6 sm:p-8 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-textPrimary">
                {reviewModal.isEdit ? 'Edit Review' : 'Write a Review'}
              </h3>
              <button
                onClick={closeReviewModal}
                className="text-textSecondary hover:text-golden transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>

            <p className="text-textSecondary text-sm mb-4">
              {reviewModal.productName}
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="block text-textPrimary text-sm font-medium mb-2">
                  Rating
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewModal((prev) => ({ ...prev, rating: star }))
                      }
                      className="p-1"
                    >
                      <Star
                        size={28}
                        className={
                          star <= reviewModal.rating
                            ? 'fill-golden text-golden'
                            : 'text-lightGreen opacity-30'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-textPrimary text-sm font-medium mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewModal.comment}
                  onChange={(e) =>
                    setReviewModal((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  required
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-100 border border-darkGreen border-opacity-30 rounded-lg text-textPrimary placeholder-textSecondary focus:outline-none focus:border-darkGreen focus:ring-2 focus:ring-darkGreen focus:ring-opacity-20 resize-none"
                  placeholder="Share your experience with this product..."
                />
              </div>

              {!reviewModal.isEdit && (
                <p className="text-xs text-textSecondary">
                  You can edit this review once after submitting.
                </p>
              )}

              {reviewModal.isEdit && (
                <p className="text-xs text-yellow-500">
                  This is your one chance to edit. After this, the review will be locked.
                </p>
              )}

              <button
                type="submit"
                disabled={submittingReview || !reviewModal.comment.trim()}
                className="w-full py-2 bg-golden text-darkGreen font-semibold rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
              >
                {submittingReview
                  ? 'Submitting...'
                  : reviewModal.isEdit
                  ? 'Update Review'
                  : 'Submit Review'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
