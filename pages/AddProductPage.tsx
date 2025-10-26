import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { categories } from '../data/products';
import BackButton from '../components/BackButton';

const AddProductPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addProduct } = useProducts();

  const [productData, setProductData] = useState({
    name: '',
    brand: '',
    category: categories[0].name,
    price: 0,
    description: '',
    stock: 0,
  });
  const [imageUrls, setImageUrls] = useState('');
  const [localImagePreviews, setLocalImagePreviews] = useState<string[]>([]);


  if (!user || user.role !== 'seller') {
    navigate('/auth');
    return null;
  }

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
        setLocalImagePreviews(prev => [...prev, ...base64Images]);
      } catch (error) {
        console.error("Error converting files to base64", error);
        alert("There was an error uploading images.");
      }
    }
  };

  const removeLocalImage = (index: number) => {
    setLocalImagePreviews(prev => prev.filter((_, i) => i !== index));
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const urlImages = imageUrls.split(',').map(url => url.trim()).filter(url => url);
    const allImages = [...localImagePreviews, ...urlImages];

    if (allImages.length === 0) {
      alert('Please add at least one image for the product.');
      return;
    }

    const productToAdd = {
      ...productData,
      images: allImages,
      sellerEmail: user.email,
    };
    addProduct(productToAdd);
    navigate('/seller-dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto bg-base-100 p-8 rounded-lg shadow-lg">
      <BackButton />
      <h1 className="text-3xl font-display font-bold mb-6 text-center">List a New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
          <input type="text" name="name" id="name" required onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
          <input type="text" name="brand" id="brand" required onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md" />
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
            <input type="number" name="price" id="price" required min="0" step="0.01" onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
            <input type="number" name="stock" id="stock" required min="0" onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md" />
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" id="description" rows={4} required onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md" />
        </div>
        
        {/* Image Upload Section */}
        <div>
            <label className="block text-sm font-medium text-gray-700">Product Images</label>
            <div className="mt-2 p-4 border-2 border-dashed rounded-md">
                <label htmlFor="image-upload" className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-md text-center block">
                    Upload from Device
                </label>
                <input id="image-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                {localImagePreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                        {localImagePreviews.map((src, index) => (
                            <div key={index} className="relative">
                                <img src={src} alt={`preview ${index}`} className="w-full h-24 object-cover rounded-md" />
                                <button type="button" onClick={() => removeLocalImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">X</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="mt-4">
                <label htmlFor="images" className="block text-sm font-medium text-gray-700">Or Add Image URLs</label>
                <p className="text-xs text-gray-500">Enter multiple image URLs separated by commas</p>
                {/* FIX: `setImageUrl` was a typo. The state setter is `setImageUrls`. */}
                <textarea name="images" id="images" rows={2} onChange={e => setImageUrls(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md" />
            </div>
        </div>

        <button type="submit" className="w-full btn bg-primary text-white hover:bg-primary-focus font-bold py-3 rounded-full text-lg">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;