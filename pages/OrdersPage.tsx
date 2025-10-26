import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from '../context/AuthContext';
import { Order, OrderItemDetails } from '../types';
import BackButton from '../components/BackButton';
import ReviewModal from '../components/ReviewModal';
import { useProducts } from '../hooks/useProducts';
import { useToast } from '../context/ToastContext';

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders] = useLocalStorage<Order[]>('orders', []);
  const { products, addReview } = useProducts();
  const { showToast } = useToast();
  const [reviewingItem, setReviewingItem] = useState<OrderItemDetails | null>(null);

  if (!user) {
    // This case is handled by ProtectedRoute, but as a fallback.
    return (
       <div className="text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-500 mb-8">Please log in to view your order history.</p>
        <Link to="/auth" className="btn bg-primary text-white hover:bg-primary-focus font-bold py-3 px-8 rounded-full">
          Login
        </Link>
      </div>
    );
  }
  
  const handleReviewSubmit = (rating: number, comment: string) => {
    if (reviewingItem && user) {
      addReview(reviewingItem.id, {
        author: user.email,
        rating,
        comment,
      });
      showToast('Review submitted successfully!', 'success');
      setReviewingItem(null); // Close the modal
    }
  };

  const hasUserReviewed = (productId: number): boolean => {
    if (!user) return false;
    const product = products.find(p => p.id === productId);
    return product?.reviews.some(r => r.author === user.email) || false;
  };
  
  const userOrders = orders.filter(order => order.items.length > 0); // Filter out empty orders just in case

  if (userOrders.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold mb-4">No Orders Yet</h1>
        <p className="text-gray-500 mb-8">You haven't placed any orders with us. Let's change that!</p>
        <Link to="/" className="btn bg-primary text-white hover:bg-primary-focus font-bold py-3 px-8 rounded-full">
          Start Shopping
        </Link>
      </div>
    );
  }

  const sortedOrders = [...userOrders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const productToReview = reviewingItem ? products.find(p => p.id === reviewingItem.id) : null;

  return (
    <div className="max-w-4xl mx-auto">
      <BackButton />
      <h1 className="text-4xl font-display font-bold mb-8 text-center">My Orders</h1>
      <div className="space-y-8">
        {sortedOrders.map((order) => (
          <div key={order.id} className="bg-base-100 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <h2 className="font-bold text-lg">Order ID: {order.id}</h2>
                <p className="text-sm text-gray-600">
                  Placed on: {new Date(order.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-bold text-lg text-primary">₹{order.total.toFixed(2)}</p>
                <span className="text-sm bg-green-200 text-green-800 font-semibold px-2 py-1 rounded">
                  Completed
                </span>
              </div>
            </div>
            <div className="p-4 md:p-6">
              <h3 className="font-semibold mb-3 text-lg">Items Ordered</h3>
              <div className="space-y-4 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <img src={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/150'} alt={item.name} className="w-20 h-20 object-cover rounded" />
                    <div className="flex-grow">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="font-semibold text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="w-full sm:w-auto mt-2 sm:mt-0">
                      {hasUserReviewed(item.id) ? (
                        <span className="text-sm font-semibold text-green-600 px-3 py-1.5 rounded-full bg-green-100">Reviewed</span>
                      ) : (
                        <button
                          onClick={() => setReviewingItem(item)}
                          className="btn btn-sm bg-secondary text-white hover:bg-secondary-focus font-bold rounded-full px-4 py-2 text-xs"
                        >
                          Write a Review
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t my-4"></div>
               <div className="bg-neutral p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-lg">Shipping To:</h3>
                  <div className="text-gray-700">
                    <p><span className="font-medium">Name:</span> {order.shippingInfo.name}</p>
                    <p><span className="font-medium">Address:</span> {order.shippingInfo.address}</p>
                    <p><span className="font-medium">Phone:</span> {order.shippingInfo.phone}</p>
                  </div>
                </div>
            </div>
          </div>
        ))}
      </div>
      {productToReview && (
        <ReviewModal
          product={productToReview}
          onClose={() => setReviewingItem(null)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
};

export default OrdersPage;