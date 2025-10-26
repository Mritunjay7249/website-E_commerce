import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import Rating from '../components/Rating';
import ProductCard from '../components/ProductCard';
import BackButton from '../components/BackButton';

const ServiceIcon: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div className="flex flex-col items-center text-center text-xs text-blue-600 hover:text-blue-800">
    <div className="w-10 h-10 flex items-center justify-center">{icon}</div>
    <span className="mt-1">{text}</span>
  </div>
);


const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, incrementView } = useProducts();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  
  const productId = parseInt(id || '');
  const product = products.find(p => p.id === productId);

  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Effect for view counting and scrolling, runs only when product ID changes
  useEffect(() => {
    if (productId) {
      incrementView(productId);
      window.scrollTo(0, 0);
    }
  }, [productId, incrementView]);

  // Effect to set the initial image, runs only when the product object itself changes
  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0]);
      setQuantity(1); // Also reset quantity for new product
    }
  }, [product]);


  if (!product) {
    return <div className="text-center text-2xl mt-12">Product not found!</div>;
  }
  
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 8);
  const complementaryProduct = products.find(p => p.category !== product.category && p.id !== product.id);
  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      showToast('Removed from wishlist', 'info');
    } else {
      addToWishlist(product);
      showToast('Added to wishlist!', 'success');
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    const buyNowItem = { ...product, quantity };
    // Navigate to checkout with the single item, separating it from the main cart
    navigate('/checkout', { state: { buyNowItem } });
  }
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`${quantity} ${product.name}(s) added to cart!`, 'success');
  }
  
  const handleBuyBoth = () => {
    if (complementaryProduct) {
      addToCart(product, 1);
      addToCart(complementaryProduct, 1);
      showToast('Both items added to cart!', 'success');
    }
  };

  const stockStatus = product.stock > 0 
    ? (product.stock < 10 ? `Only ${product.stock} left in stock` : 'In stock')
    : 'Out of Stock';
  const stockColor = product.stock > 0 ? (product.stock < 10 ? 'text-orange-500' : 'text-green-600') : 'text-red-500';
  const isSale = product.originalPrice && product.originalPrice > product.price;
  const discount = isSale ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0;
  const isShopsphereChoice = product.rating > 4.7 && product.reviewsCount > 100;

  return (
    <div key={productId} className="space-y-4">
      <BackButton />
      <div className="text-sm text-gray-500">
        <Link to="/" className="hover:text-primary">Home</Link> &gt; 
        <Link to={`/products/${product.category}`} className="hover:text-primary"> {product.category}</Link> &gt; 
        <span className="text-gray-700"> {product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-5 flex gap-2">
          <div className="flex flex-col gap-2">
            {product.images.map((img, index) => (
              <button 
                key={index} 
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 rounded-md overflow-hidden border-2 p-1 ${selectedImage === img ? 'border-primary' : 'border-gray-200'}`}
              >
                <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex-grow aspect-w-1 aspect-h-1 bg-white rounded-lg flex items-center justify-center p-2 border">
            <img src={selectedImage} alt={product.name} className="max-h-[450px] object-contain" />
          </div>
        </div>
        
        {/* Middle Column: Product Info */}
        <div className="lg:col-span-4">
          <h1 className="text-2xl font-semibold mb-1">{product.name}</h1>
          <a href="#" className="text-sm text-blue-600 hover:underline hover:text-orange-500 mb-2 block">Visit the {product.brand} Store</a>

          <div className="flex items-center gap-4 mb-3">
            <Rating value={product.rating} />
            <a href="#reviews" className="text-sm text-blue-600 hover:underline">{product.reviewsCount} ratings</a>
          </div>
          {isShopsphereChoice && (
             <div className="inline-block bg-gray-700 text-white text-xs font-bold px-3 py-1 rounded-sm mb-4">
              ShopSphere's <span className="text-orange-400">Choice</span>
            </div>
          )}

          <hr className="my-4"/>

          <div className="space-y-2 mb-4">
            {isSale && (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-red-600">-{discount}%</span>
                <span className="text-4xl font-semibold text-gray-800">₹{product.price.toFixed(2)}</span>
              </div>
            )}
            {!isSale && (
                 <span className="text-4xl font-semibold text-gray-800">₹{product.price.toFixed(2)}</span>
            )}
            {isSale && (
              <p className="text-sm text-gray-500">
                M.R.P.: <span className="line-through">₹{product.originalPrice?.toFixed(2)}</span>
              </p>
            )}
             <p className="text-xs text-gray-500">Inclusive of all taxes</p>
          </div>
          
          <hr className="my-4"/>

          <div className="grid grid-cols-4 gap-2 my-4">
              <ServiceIcon icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2.5-1.5L8 17l2.5-1.5L13 16z" /></svg>} text="Free Delivery"/>
              <ServiceIcon icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 11a8.1 8.1 0 00-15.5-2 8.1 8.1 0 00-2.5 15.5" /></svg>} text="10 days Replacement"/>
              <ServiceIcon icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12 12 0 0012 21.944a12 12 0 008.618-3.04A11.955 11.955 0 0112 2.944z" /></svg>} text="Warranty"/>
              <ServiceIcon icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} text="Pay on Delivery"/>
          </div>

          <hr className="my-4"/>
          
          <div>
            <h3 className="font-bold text-lg mb-2">About this item</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
              {product.description.split('. ').filter(s => s).map((sentence, i) => (
                <li key={i}>{sentence}</li>
              ))}
            </ul>
          </div>

        </div>

        {/* Right Column: Action Panel */}
        <div className="lg:col-span-3">
            <div className="border rounded-lg p-4 space-y-4">
              <div className="text-3xl font-semibold text-gray-800">₹{product.price.toFixed(2)}</div>
              <p className="text-sm">FREE delivery <span className="font-bold">Tomorrow</span>. Order within <span className="text-green-600 font-semibold">10 hrs</span>.</p>
              <p className={`font-semibold text-lg ${stockColor}`}>{stockStatus}</p>

              <div className="flex items-center gap-2">
                <label htmlFor="quantity">Quantity:</label>
                <select 
                    id="quantity" 
                    value={quantity} 
                    onChange={(e) => setQuantity(parseInt(e.target.value))} 
                    className="border rounded-md px-2 py-1 bg-gray-100 shadow-sm"
                    disabled={product.stock === 0}
                >
                    {[...Array(Math.min(product.stock, 10)).keys()].map(i => (
                        <option key={i+1} value={i+1}>{i+1}</option>
                    ))}
                </select>
              </div>

              <button onClick={handleAddToCart} disabled={product.stock === 0} className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-2.5 px-4 rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed">
                Add to Cart
              </button>
              <button onClick={handleBuyNow} disabled={product.stock === 0} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed">
                Buy Now
              </button>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <span>Secure transaction</span>
              </div>
              <hr/>
              <p className="text-xs">Sold by <span className="text-blue-600">{product.sellerEmail === 'admin@shopsphere.com' ? 'ShopSphere' : product.sellerEmail}</span></p>
               <button onClick={handleWishlistToggle} className="w-full text-left bg-white hover:bg-gray-100 border border-gray-300 text-sm font-semibold py-2 px-3 rounded-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${inWishlist ? 'text-accent' : 'text-gray-400'}`} fill={inWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{inWishlist ? 'Added to Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>
        </div>
      </div>
      
      {/* Frequently Bought Together Section */}
      {complementaryProduct && (
        <div className="bg-base-100 shadow-xl rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-display font-bold mb-6">Frequently Bought Together</h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-2">
              <Link to={`/product/${product.id}`} className="block">
                <img src={product.images[0]} alt={product.name} className="w-24 h-24 object-cover rounded-lg border"/>
              </Link>
              <div className="text-sm font-semibold max-w-[150px]">{product.name}</div>
            </div>
            <div className="text-3xl font-light text-gray-400">+</div>
            <div className="flex items-center gap-2">
               <Link to={`/product/${complementaryProduct.id}`} className="block">
                 <img src={complementaryProduct.images[0]} alt={complementaryProduct.name} className="w-24 h-24 object-cover rounded-lg border"/>
              </Link>
              <div className="text-sm font-semibold max-w-[150px]">{complementaryProduct.name}</div>
            </div>
            <div className="md:ml-auto md:border-l md:pl-6 mt-4 md:mt-0 text-center md:text-left">
              <p className="text-lg">Total price:</p>
              <p className="text-2xl font-bold text-primary mb-3">₹{(product.price + complementaryProduct.price).toFixed(2)}</p>
              <button onClick={handleBuyBoth} className="btn bg-secondary text-white hover:bg-secondary-focus rounded-full px-6 py-2 font-bold">
                Add both to cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div id="reviews" className="bg-base-100 shadow-xl rounded-lg p-8">
        <h2 className="text-3xl font-display font-bold mb-6">Customer Reviews</h2>
        {product.reviews.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map(review => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <Rating value={review.rating} />
                  <p className="ml-4 font-bold">{review.author}</p>
                </div>
                <p className="text-gray-600">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(review.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews yet. Be the first to review this product!</p>
        )}
      </div>

       {/* Customers Who Viewed This Item Also Viewed Section */}
       {relatedProducts.length > 0 && (
         <div className="py-8">
            <div className="container mx-auto">
                <h2 className="text-3xl font-display font-bold mb-6">Customers Who Viewed This Item Also Viewed</h2>
                <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4">
                    {relatedProducts.map(relatedProduct => (
                        <div key={relatedProduct.id} className="flex-shrink-0 w-64">
                            <ProductCard product={relatedProduct} />
                        </div>
                    ))}
                </div>
            </div>
         </div>
       )}
    </div>
  );
};

export default ProductDetailsPage;