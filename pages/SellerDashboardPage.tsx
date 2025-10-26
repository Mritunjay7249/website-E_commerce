import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import useLocalStorage from '../hooks/useLocalStorage';
import { Order } from '../types';
import { useToast } from '../context/ToastContext';

const SellerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { products, deleteProduct } = useProducts();
  const [orders] = useLocalStorage<Order[]>('orders', []);
  const { showToast } = useToast();
  
  // Memoize sales calculation for performance
  const salesData = useMemo(() => {
    const data = new Map<number, number>(); // Map<productId, salesCount>
    if (user) {
      orders.forEach(order => {
        order.items.forEach(item => {
          if (item.sellerEmail === user.email) {
            const currentSales = data.get(item.id) || 0;
            data.set(item.id, currentSales + item.quantity);
          }
        });
      });
    }
    return data;
  }, [orders, user]);
  
  const handleDelete = (productId: number, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      deleteProduct(productId);
      showToast('Product deleted successfully', 'info');
    }
  };

  if (!user || user.role !== 'seller') {
    navigate('/auth');
    return null;
  }

  const sellerProducts = products.filter(p => p.sellerEmail === user.email);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-display font-bold">Seller Dashboard</h1>
        <Link to="/add-product" className="btn bg-primary text-white hover:bg-primary-focus font-bold py-2 px-6 rounded-full">
          + Add New Product
        </Link>
      </div>

      {sellerProducts.length > 0 ? (
        <div className="bg-base-100 rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold text-center">Stock</th>
                <th className="p-4 font-semibold text-center">Views</th>
                <th className="p-4 font-semibold text-center">Sales</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellerProducts.map(product => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-4">
                    <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded" />
                    <span className="font-medium">{product.name}</span>
                  </td>
                  <td className="p-4">₹{product.price.toFixed(2)}</td>
                  <td className="p-4 text-center">{product.stock}</td>
                  <td className="p-4 text-center">{product.views}</td>
                  <td className="p-4 text-center font-bold">{salesData.get(product.id) || 0}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Link to={`/edit-product/${product.id}`} className="btn btn-sm bg-blue-100 text-blue-700 hover:bg-blue-200 px-4">Edit</Link>
                      <button onClick={() => handleDelete(product.id, product.name)} className="btn btn-sm bg-red-100 text-red-700 hover:bg-red-200 px-3">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 bg-base-100 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">No products listed yet!</h2>
          <p className="text-gray-500 mb-8">Click the button below to add your first product and start selling.</p>
          <Link to="/add-product" className="btn bg-primary text-white hover:bg-primary-focus font-bold py-3 px-8 rounded-full">
            Add Your First Product
          </Link>
        </div>
      )}
    </div>
  );
};

export default SellerDashboardPage;