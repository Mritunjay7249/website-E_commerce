import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { categories } from '../data/products';
import BackButton from '../components/BackButton';
import { useToast } from '../context/ToastContext';
import { Product } from '../types';

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id) : null;
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { products, updateProduct } = useProducts();
  const { showToast } = useToast();

  const [productData, setProductData] = useState<Omit<Product, 'id' | 'sellerEmail' | 'rating' | 'reviewsCount' | 'reviews' | 'views' | 'images'> | null>(null);
  const [images, setImages] = useState<string[]>([]);
  
  useEffect(() => {
    const productToEdit = products.find(p => p.id === productId);
    // Ensure product exists and is owned by the currently logged-in seller
    if (productToEdit && user && productToEdit.sellerEmail === user.email) {
      const { id, sellerEmail, rating, reviewsCount, reviews, views, images: productImages, ...formData } = productToEdit;
      setProductData(formData);
      setImages(productImages);
    } else {
      showToast('Product not found or you do not have permission to edit it.', 'error');
      navigate('/seller-dashboard');
    }
  }, [productId, products, user, navigate, showToast]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const base64Promises = files.map(fileToBase64);
      try {
        const base64Images = await Promise.all(base64Promises);
        setImages(prev => [...prev, ...base64Images]);
      } catch (error) {
        console.error("Error converting files to base64", error);
        alert("There was an error uploading images.");
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!productData) return;
    const { name, value, type } = e.target;
    setProductData(prev => ({
      ...prev!,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productData || !productId) return;
    
    if (images.length === 0) {
      alert('A product must have at least one image.');
      return;
    }
    
    updateProduct(productId, { ...productData, images });
    showToast('Product updated successfully!', 'success');
    navigate('/seller-dashboard');
  };
  
  if (!productData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-base-100 p-8 rounded-lg shadow-lg">
      <BackButton />
      <h1 className="text-3xl font-display font-bold mb-6 text-center">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
          <input type="text" name="name" id="name" required value={productData.name} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
          <input type="text" name="brand" id="brand" required value={productData.brand} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select name="category" id="category" value={productData.category} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md">
            {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₹)</label>
            <input type="number" name="price" id="price" required min="0" step="0.01" value={productData.price} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
            <input type="number" name="stock" id="stock" required min="0" value={productData.stock} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md" />
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" id="description" rows={4} required value={productData.description} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md" />
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-700">Product Images</label>
            <div className="mt-2 p-4 border-2 border-dashed rounded-md">
                <label htmlFor="image-upload" className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-md text-center block">
                    Upload New Images
                </label>
                <input id="image-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                        {images.map((src, index) => (
                            <div key={index} className="relative">
                                <img src={src} alt={`preview ${index}`} className="w-full h-24 object-cover rounded-md" />
                                <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">X</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        <button type="submit" className="w-full btn bg-primary text-white hover:bg-primary-focus font-bold py-3 rounded-full text-lg">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;