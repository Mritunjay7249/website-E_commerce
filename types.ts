export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  stock: number;
  tags?: string[];
  sellerEmail: string;
  views: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  email: string;
  password?: string;
  role: 'customer' | 'seller';
}

export interface OrderItemDetails {
  id: number;
  name: string;
  images: string[];
  price: number; // Price at the time of purchase
  quantity: number;
  sellerEmail: string;
}


export interface Order {
  id: string;
  items: OrderItemDetails[];
  total: number;
  date: string;
  shippingInfo: {
    name: string;
    address: string;
    phone: string;
  };
}

export interface Category {
  name: string;
  image: string;
  icon: string;
}
