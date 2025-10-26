import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { categories } from '../data/products';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';

const Navbar: React.FC = () => {
  const { getCartItemCount } = useCart();
  const { getWishlistItemCount } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { products } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(lowercasedQuery) ||
      product.brand.toLowerCase().includes(lowercasedQuery) ||
      product.category.toLowerCase().includes(lowercasedQuery)
    );
    setSearchResults(filtered.slice(0, 5)); // Show top 5 results
  }, [searchQuery, products]);


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isSeller = user?.role === 'seller';
  const navCategories = categories.slice(0, 4); // Take first 4 categories for nav

  return (
    <header className="bg-base-100 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="navbar flex justify-between items-center py-3">
          <div className="flex items-center">
            <Link to={isSeller ? "/seller-dashboard" : "/"} className="text-2xl lg:text-3xl font-bold font-display text-primary">
              ShopSphere
            </Link>
          </div>

          {!isSeller && (
            <div className="hidden lg:flex flex-1 justify-center px-8">
              <div 
                className="relative w-full max-w-lg"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => {
                  // Delay hiding to allow click event on results to fire
                  setTimeout(() => setIsSearchFocused(false), 200);
                }}
              >
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-focus"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="absolute right-0 top-0 mt-1 mr-1 p-2 rounded-full bg-primary text-white hover:bg-primary-focus">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
                {isSearchFocused && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-lg shadow-xl z-30 mt-1">
                    <ul>
                      {searchResults.map(product => (
                        <li key={product.id} className="border-b last:border-b-0">
                          <Link
                            to={`/product/${product.id}`}
                            className="flex items-center p-3 hover:bg-gray-100 transition-colors"
                            onClick={() => {
                              setSearchQuery('');
                            }}
                          >
                            <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover mr-4 rounded" />
                            <div className="overflow-hidden">
                              <p className="font-semibold text-sm truncate">{product.name}</p>
                              <p className="text-xs text-gray-500">{product.category}</p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            {!isSeller && (
              <>
                <Link to="/wishlist" className="relative group p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-600 group-hover:text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  {getWishlistItemCount() > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-accent rounded-full">
                      {getWishlistItemCount()}
                    </span>
                  )}
                </Link>
                
                <Link to="/cart" className="relative group p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-600 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  {getCartItemCount() > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-accent rounded-full">
                      {getCartItemCount()}
                    </span>
                  )}
                </Link>
              </>
            )}
            
            {user ? (
              <div className="relative group">
                <button className="p-2 rounded-full bg-gray-200 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </button>
                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">{user.email}</div>
                    {isSeller ? (
                        <Link to="/seller-dashboard" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Seller Dashboard</Link>
                    ) : (
                        <Link to="/orders" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Orders</Link>
                    )}
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/auth" className="btn btn-sm bg-secondary text-white hover:bg-secondary-focus font-bold rounded-full px-4 py-2 text-sm">
                Login
              </Link>
            )}
          </div>
        </div>
        {/* Bottom bar */}
         {!isSeller && (
            <div className="hidden lg:flex items-center justify-center gap-8 py-2 border-t text-sm font-medium">
              <Link to="/" className="text-gray-600 hover:text-primary">Deals</Link>
              {navCategories.map(cat => (
                 <Link key={cat.name} to={`/products/${cat.name}`} className="text-gray-600 hover:text-primary">{cat.name}</Link>
              ))}
              <Link to="/products/Grocery" className="text-gray-600 hover:text-primary">Grocery</Link>
            </div>
         )}
      </div>
    </header>
  );
};

export default Navbar;