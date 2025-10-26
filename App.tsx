import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSummaryPage from './pages/OrderSummaryPage';
import AuthPage from './pages/AuthPage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import ProtectedRoute from './components/ProtectedRoute';
import SellerRegistrationPage from './pages/SellerRegistrationPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import FaqPage from './pages/FaqPage';
import ShippingPolicyPage from './pages/ShippingPolicyPage';
import DonationPage from './pages/DonationPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <ToastProvider>
            <HashRouter>
              <Layout>
                <Routes>
                  {/* Customer & Guest Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['customer', null]} />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products/:category" element={<ProductsPage />} />
                    <Route path="/product/:id" element={<ProductDetailsPage />} />
                  </Route>
                  
                  {/* Customer-Only Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-summary" element={<OrderSummaryPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                  </Route>

                  {/* Seller-Only Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['seller']} />}>
                    <Route path="/seller-dashboard" element={<SellerDashboardPage />} />
                    <Route path="/add-product" element={<AddProductPage />} />
                    <Route path="/edit-product/:id" element={<EditProductPage />} />
                  </Route>

                  {/* Public Routes */}
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/seller-signup" element={<SellerRegistrationPage />} />
                  <Route path="/about" element={<AboutUsPage />} />
                  <Route path="/contact" element={<ContactUsPage />} />
                  <Route path="/faq" element={<FaqPage />} />
                  <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
                  <Route path="/donate" element={<DonationPage />} />
                </Routes>
              </Layout>
            </HashRouter>
          </ToastProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
};

export default App;