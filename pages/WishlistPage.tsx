import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Product } from '../types';
import Rating from '../components/Rating';
import BackButton from '../components/BackButton';

const WishlistItem: React.FC<{ item: Product }> = ({ item }) => {
    const { removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { showToast } = useToast();

    const handleMoveToCart = () => {
        addToCart(item, 1);
        removeFromWishlist(item.id);
        showToast('Moved to cart!', 'success');
    };

    const handleRemove = () => {
        removeFromWishlist(item.id);
        showToast('Removed from wishlist', 'info');
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b gap-4">
            <div className="flex items-center w-full sm:w-2/5">
                <img src={item.images[0]} alt={item.name} className="w-24 h-24 object-cover rounded-lg mr-4" />
                <div>
                    <Link to={`/product/${item.id}`} className="font-bold text-lg hover:text-primary">{item.name}</Link>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <Rating value={item.rating} />
                </div>
            </div>
            <div className="w-full sm:w-1/5 text-left sm:text-center font-semibold text-xl text-primary">
                ₹{item.price.toFixed(2)}
            </div>
            <div className="w-full sm:w-2/5 flex justify-end gap-2">
                 <button onClick={handleMoveToCart} className="btn bg-secondary text-white hover:bg-secondary-focus rounded-full px-4 py-2 text-sm font-bold">
                    Move to Cart
                </button>
                <button onClick={handleRemove} className="btn btn-ghost text-red-500 hover:bg-red-100 rounded-full px-4 py-2 text-sm font-bold">
                    Remove
                </button>
            </div>
        </div>
    )
}


const WishlistPage: React.FC = () => {
  const { wishlistItems } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
        <p className="text-gray-500 mb-8">Add items you love to your wishlist to save them for later.</p>
        <Link to="/" className="btn bg-primary text-white hover:bg-primary-focus font-bold py-3 px-8 rounded-full">
          Discover Products
        </Link>
      </div>
    );
  }

  return (
    <div>
        <BackButton />
        <div className="bg-base-100 shadow-lg rounded-lg p-4 md:p-8">
        <h1 className="text-3xl font-display font-bold mb-6">My Wishlist ({wishlistItems.length})</h1>
        <div className="flex flex-col">
            {wishlistItems.map(item => (
            <WishlistItem key={item.id} item={item} />
            ))}
        </div>
        </div>
    </div>
  );
};

export default WishlistPage;