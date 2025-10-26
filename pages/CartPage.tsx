import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types';
import BackButton from '../components/BackButton';

const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center w-2/5">
        <img src={item.images[0]} alt={item.name} className="w-20 h-20 object-cover rounded-lg mr-4" />
        <div>
          <p className="font-bold">{item.name}</p>
          <p className="text-sm text-gray-500">₹{item.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center justify-center w-1/5">
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
          className="w-16 text-center border rounded"
        />
      </div>
      <div className="w-1/5 text-center font-semibold">₹{(item.price * item.quantity).toFixed(2)}</div>
      <div className="w-1/5 text-right">
        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>
  );
};

const CartPage: React.FC = () => {
  const { cartItems, getCartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="btn bg-primary text-white hover:bg-primary-focus font-bold py-3 px-8 rounded-full">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <BackButton />
      <div className="bg-base-100 shadow-lg rounded-lg p-4 md:p-8">
        <h1 className="text-3xl font-display font-bold mb-6">Shopping Cart</h1>
        <div className="hidden md:flex font-bold text-gray-500 uppercase text-sm border-b pb-4">
          <div className="w-2/5">Product</div>
          <div className="w-1/5 text-center">Quantity</div>
          <div className="w-1/5 text-center">Subtotal</div>
          <div className="w-1/5 text-right">Remove</div>
        </div>
        <div>
          {cartItems.map(item => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-2xl font-bold mb-4 md:mb-0">
            Total: <span className="text-primary">₹{getCartTotal().toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="btn bg-success text-white hover:bg-green-600 font-bold py-3 px-12 rounded-full text-lg">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;