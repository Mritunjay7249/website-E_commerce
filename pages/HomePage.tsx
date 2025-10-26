import React from 'react';
import { Link } from 'react-router-dom';
import { categories, products } from '../data/products';
import { useProducts } from '../hooks/useProducts';
import Rating from '../components/Rating';
import { Product } from '../types';
import { useCart } from '../context/CartContext';


const PromotionsBanner: React.FC = () => {
  const handlePersonalizedClick = () => {
    const element = document.getElementById('personalized-picks');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-primary text-white rounded-lg p-6 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={handlePersonalizedClick}
          role="button"
          tabIndex={0}
          className="relative rounded-lg overflow-hidden h-40 flex items-end p-4 bg-cover bg-center cursor-pointer hover:scale-105 transition-transform"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504274066651-8d31a536b11a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3')" }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative">
            <h3 className="font-bold text-xl">Personalized Picks</h3>
            <p className="text-sm">For You</p>
          </div>
        </div>
        <Link
          to="/products/Fashion"
          className="relative rounded-lg overflow-hidden h-40 flex items-end p-4 bg-cover bg-center cursor-pointer hover:scale-105 transition-transform"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3')" }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative">
            <h3 className="font-bold text-xl">Flash Sale: UP 50% Off</h3>
            <p className="text-sm">Limited Time Deals</p>
          </div>
        </Link>
        <Link
          to="/products/Electronics"
          className="relative rounded-lg overflow-hidden h-40 flex items-end p-4 bg-cover bg-center cursor-pointer hover:scale-105 transition-transform"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3')" }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative">
            <h3 className="font-bold text-xl">New Smart Devices</h3>
            <p className="text-sm">Shop The Future</p>
          </div>
        </Link>
      </div>
    </section>
  );
};

const ActivityProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  return (
    <div className="bg-base-100 p-4 rounded-lg shadow-md border border-gray-200 w-60 flex-shrink-0">
      <Link to={`/product/${product.id}`}>
        <img src={product.images[0]} alt={product.name} className="w-full h-32 object-contain mb-4 rounded"/>
      </Link>
      <h4 className="font-semibold text-gray-800 text-sm h-10 truncate">{product.name}</h4>
      <div className="my-2">
        <Rating value={product.rating} />
      </div>
      <button 
        onClick={() => addToCart(product, 1)}
        className="w-full text-center py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
};


const PersonalizedPicks: React.FC = () => {
    const { products } = useProducts();
    const personalizedProducts = [...products].sort((a,b) => b.views - a.views).slice(0, 5);

    return (
        <section id="personalized-picks" className="mb-12">
            <h2 className="text-2xl font-bold mb-1 text-gray-800">For You, Based On Your Activity</h2>
            <p className="text-gray-600 mb-6">Tailored recommendations</p>
            <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4">
                {personalizedProducts.map(p => <ActivityProductCard key={p.id} product={p} />)}
            </div>
        </section>
    )
};


const PopularCategoryCard: React.FC<{ category: typeof categories[0] }> = ({ category }) => (
  <Link to={`/products/${category.name}`} className="block group">
    <div className="bg-base-100 p-4 rounded-lg shadow-md border border-gray-200 text-center transition-transform transform hover:scale-105 hover:shadow-xl">
        <img src={category.image} alt={category.name} className="w-full h-40 object-cover mb-4 rounded-md"/>
        <h3 className="font-bold text-lg text-gray-800">{category.name}</h3>
        <Rating value={4.5 + Math.random() * 0.5} />
    </div>
  </Link>
);


const PopularCategories: React.FC = () => (
    <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Shop Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories.map(cat => <PopularCategoryCard key={cat.name} category={cat} />)}
        </div>
    </section>
);


const TrendingNow: React.FC = () => {
    const trendingProducts = products.filter(p => p.tags?.includes('Trending')).slice(0, 5);
     return (
        <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Trending Now</h2>
             <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4">
                {trendingProducts.map(p => <ActivityProductCard key={p.id} product={p} />)}
            </div>
        </section>
    )
};

const DonationBanner: React.FC = () => (
  <section className="bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg p-8 mb-12 flex flex-col md:flex-row items-center justify-between shadow-lg">
    <div>
      <h2 className="text-3xl font-display font-bold mb-2">Support Our Cause</h2>
      <p className="max-w-xl mb-4 md:mb-0">
        Your generous donations help us maintain this platform and continue to serve our community. Every contribution, big or small, makes a difference.
      </p>
    </div>
    <Link to="/donate" className="btn bg-white text-primary hover:bg-neutral font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 whitespace-nowrap">
      Donate Now
    </Link>
  </section>
);


const HomePage: React.FC = () => {
  return (
    <div className="space-y-8">
      <PromotionsBanner />
      <PersonalizedPicks />
      <PopularCategories />
      <TrendingNow />
      <DonationBanner />
    </div>
  );
};

export default HomePage;