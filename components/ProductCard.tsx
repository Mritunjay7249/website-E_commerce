import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import Rating from './Rating';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
      showToast('Removed from wishlist', 'info');
    } else {
      addToWishlist(product);
      showToast('Added to wishlist!', 'success');
    }
  };

  const isSale = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="card bg-base-100 shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl flex flex-col">
      <div className="relative">
        <Link to={`/product/${product.id}`} className="block">
          <figure className="aspect-w-1 aspect-h-1 w-full">
            <img src={product.images[0]} alt={product.name} className="object-cover w-full h-48" />
          </figure>
        </Link>
        {isSale && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            SALE
          </div>
        )}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-2 rounded-full bg-white/70 backdrop-blur-sm transition-colors ${inWishlist ? 'text-accent' : 'text-gray-500 hover:text-accent'}`}
          aria-label="Toggle Wishlist"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={inWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <div className="card-body p-4 flex flex-col flex-grow">
        <p className="text-sm text-gray-500">{product.brand}</p>
        <h2 className="card-title font-display text-lg font-semibold text-gray-800 truncate h-14">{product.name}</h2>
        <div className="my-2">
          <Rating value={product.rating} text={`(${product.reviewsCount})`} />
        </div>
        <div className="flex-grow"></div>
        <div className="card-actions justify-between items-center mt-4">
          <div className="flex items-baseline gap-2">
             <span className="text-xl font-bold text-primary">₹{product.price.toFixed(2)}</span>
             {isSale && (
                <span className="text-sm text-gray-500 line-through">₹{product.originalPrice?.toFixed(2)}</span>
             )}
          </div>
          <button
            onClick={() => {
              addToCart(product, 1)
              showToast('Added to cart!', 'success');
            }}
            className="btn bg-secondary text-white hover:bg-secondary-focus rounded-full px-4 py-2 text-sm font-bold transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;