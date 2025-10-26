import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import BackButton from '../components/BackButton';

const priceRanges = [
  { label: 'Any Price', value: '' },
  { label: 'Under ₹5,000', value: '0-5000' },
  { label: '₹5,000 to ₹10,000', value: '5000-10000' },
  { label: '₹10,000 to ₹25,000', value: '10000-25000' },
  { label: 'Over ₹25,000', value: '25000-Infinity' },
];

const ProductsPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { products } = useProducts();

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('relevance');

  const categoryProducts = useMemo(() => 
    category 
      ? products.filter(p => p.category.toLowerCase() === category.toLowerCase()) 
      : products,
    [products, category]
  );
  
  const availableBrands = useMemo(() => 
    [...new Set(categoryProducts.map(p => p.brand))],
    [categoryProducts]
  );

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };
  
  const displayedProducts = useMemo(() => {
    let items = [...categoryProducts];

    // Filter by brand
    if (selectedBrands.length > 0) {
      items = items.filter(p => selectedBrands.includes(p.brand));
    }

    // Filter by price
    if (selectedPrice) {
      const [min, max] = selectedPrice.split('-').map(parseFloat);
      items = items.filter(p => p.price >= min && p.price <= (max || Infinity));
    }

    // Sort
    switch (sortOrder) {
      case 'price-asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        items.sort((a, b) => b.rating - a.rating);
        break;
      case 'relevance':
        items.sort((a, b) => b.views - a.views); // Sort by views as relevance
        break;
      default:
        break;
    }

    return items;
  }, [categoryProducts, selectedBrands, selectedPrice, sortOrder]);
  
  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedPrice('');
  };

  return (
    <div>
      <BackButton />
      <h1 className="text-4xl font-display font-bold mb-8 text-center">{category || 'All Products'}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 bg-base-100 p-6 rounded-lg shadow-lg h-fit sticky top-24">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Filters</h2>
            {(selectedBrands.length > 0 || selectedPrice) && (
              <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline">Clear</button>
            )}
          </div>
          
          <div className="space-y-6">
            {/* Brand Filter */}
            <div>
              <h3 className="font-semibold mb-3 border-b pb-2">Brand</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {availableBrands.map(brand => (
                  <label key={brand} className="flex items-center">
                    <input 
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary-focus"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                    />
                    <span className="ml-3 text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="font-semibold mb-3 border-b pb-2">Price</h3>
              <div className="space-y-2">
                 {priceRanges.map(range => (
                  <label key={range.value} className="flex items-center">
                    <input
                      type="radio"
                      name="price"
                      className="h-4 w-4 border-gray-300 text-primary focus:ring-primary-focus"
                      value={range.value}
                      checked={selectedPrice === range.value}
                      onChange={(e) => setSelectedPrice(e.target.value)}
                    />
                    <span className="ml-3 text-gray-700">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6 bg-base-100 p-4 rounded-lg shadow-sm">
            <p className="text-gray-600">{displayedProducts.length} items found</p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium">Sort by:</label>
              <select 
                id="sort"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border border-gray-300 rounded-md p-2 text-sm focus:ring-primary-focus focus:border-primary-focus"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Customer Rating</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 text-xl py-20 bg-base-100 rounded-lg shadow-sm">
              <p className="font-semibold text-2xl mb-2">No products match your filters</p>
              <p>Try clearing some filters to see more results.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;