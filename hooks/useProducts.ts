import { useState, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { Product, Review } from '../types';
import { products as initialProducts } from '../data/products';

// This custom hook centralizes all product-related logic.
// It manages a combined list of initial products and products added by sellers.
export const useProducts = () => {
  // We use localStorage to persist all product data, including view counts and seller-added items.
  // We initialize it with the static product data if it's the first time the user visits.
  const [allProducts, setAllProducts] = useLocalStorage<Product[]>('allProducts', initialProducts);

  const addProduct = useCallback((productData: Omit<Product, 'id' | 'rating' | 'reviewsCount' | 'reviews' | 'views'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now(), // Use timestamp for a simple unique ID
      rating: 0,
      reviewsCount: 0,
      reviews: [],
      views: 0,
    };
    setAllProducts(prev => [...prev, newProduct]);
  }, [setAllProducts]);

  const updateProduct = useCallback((productId: number, updatedData: Omit<Product, 'id' | 'sellerEmail' | 'rating' | 'reviewsCount' | 'reviews' | 'views'>) => {
    setAllProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          return {
            ...p, // keep original id, sellerEmail, reviews, etc.
            ...updatedData, // apply the new data from the form
          };
        }
        return p;
      })
    );
  }, [setAllProducts]);

  const deleteProduct = useCallback((productId: number) => {
    setAllProducts(prev => prev.filter(p => p.id !== productId));
  }, [setAllProducts]);


  const incrementView = useCallback((productId: number) => {
    // This function ensures that view counts are updated and persisted.
    setAllProducts(prev => 
      prev.map(p => 
        p.id === productId ? { ...p, views: p.views + 1 } : p
      )
    );
  }, [setAllProducts]);

  const addReview = useCallback((productId: number, reviewData: { author: string; rating: number; comment: string; }) => {
    setAllProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const newReview: Review = {
            id: Date.now(),
            date: new Date().toISOString(),
            ...reviewData
          };
          const updatedReviews = [newReview, ...p.reviews];
          const newTotalRating = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
          
          return {
            ...p,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: newTotalRating / updatedReviews.length,
          };
        }
        return p;
      })
    );
  }, [setAllProducts]);

  return { products: allProducts, addProduct, updateProduct, deleteProduct, incrementView, addReview };
};