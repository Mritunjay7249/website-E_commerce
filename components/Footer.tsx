import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-display font-bold mb-4 text-secondary">ShopSphere</h3>
            <p className="text-gray-300">Your one-stop shop for everything you need. Quality products, unbeatable prices.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/products/Electronics" className="text-gray-300 hover:text-white">Electronics</Link></li>
              <li><Link to="/products/Fashion" className="text-gray-300 hover:text-white">Fashion</Link></li>
              <li><Link to="/cart" className="text-gray-300 hover:text-white">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white">FAQ</Link></li>
              <li><Link to="/shipping-policy" className="text-gray-300 hover:text-white">Shipping Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white text-2xl">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-1.5c-.86 0-1 .41-1 1V12h2.5l-.5 3H13v6.8c4.56-.93 8-4.96 8-9.8z"></path></svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-2xl">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 8.29c.02.13.02.26.02.39 0 4.02-3.07 8.65-8.65 8.65-1.71 0-3.31-.5-4.66 1.36.24.03.48.04.72.04 1.42 0 2.73-.48 3.77-1.3-1.33-.02-2.45-.9-2.84-2.1.18.03.37.06.56.06.28 0 .55-.04.81-.11-1.39-.28-2.43-1.5-2.43-2.96v-.04c.41.23.88.36 1.37.38-1.29-.86-1.78-2.58-1.1-4.08 1.5 1.83 3.73 3.03 6.2 3.14-.05-.22-.08-.45-.08-.69 0-1.67 1.35-3.02 3.02-3.02.87 0 1.66.37 2.21.96.69-.14 1.34-.39 1.92-.73-.23.71-.71 1.3-1.34 1.68.61-.07 1.2-.23 1.73-.47-.41.6-.93 1.13-1.54 1.58z"></path></svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-2xl">
                 <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true"><path clipRule="evenodd" fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h4v-7h-4v7zm0-9h4V6h-4v2z"></path></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300 text-sm">
          &copy; {new Date().getFullYear()} ShopSphere. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;