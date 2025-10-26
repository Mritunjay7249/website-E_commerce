import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { Order } from '../types';
import BackButton from '../components/BackButton';

// FIX: Changed icon type from JSX.Element to React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
const StatusStep: React.FC<{ icon: React.ReactNode; title: string; active?: boolean; done?: boolean }> = ({ icon, title, active, done }) => (
    <div className="flex flex-col items-center justify-start text-center w-24">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${done ? 'bg-success text-white' : active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
            {icon}
        </div>
        <p className={`mt-2 text-sm font-semibold w-full ${active || done ? 'text-primary' : 'text-gray-600'}`}>{title}</p>
    </div>
);


const OrderSummaryPage: React.FC = () => {
    const location = useLocation();
    const orderId = location.state?.orderId;
    const [orders] = useLocalStorage<Order[]>('orders', []);
    const order = orders.find(o => o.id === orderId);

    if (!order) {
        return (
             <div className="text-center bg-base-100 p-12 rounded-lg shadow-xl max-w-2xl mx-auto">
                <h1 className="text-3xl font-display font-bold text-error mb-4">Order Not Found</h1>
                <p className="text-gray-600 mb-8">We couldn't find the details for this order. Please check your order history.</p>
                <Link to="/" className="btn bg-primary text-white hover:bg-primary-focus font-bold py-3 px-8 rounded-full">
                    Back to Home
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <BackButton />
            <div className="text-center">
                <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-4xl font-display font-bold text-success mb-2">Thank You For Your Order!</h1>
                <p className="text-gray-600">Your order ID is <span className="font-semibold text-primary">{order.id}</span>. You can track its status below.</p>
            </div>

            {/* Status Tracker */}
            <div className="bg-base-100 p-6 sm:p-8 rounded-lg shadow-lg">
                <div className="flex justify-center items-center relative">
                    <div className="absolute top-6 left-0 w-full h-1 bg-gray-200">
                        <div className="h-1 bg-success" style={{ width: '15%' }}></div>
                    </div>
                    <div className="flex justify-between w-full relative">
                        <StatusStep 
                            title="Order Confirmed" 
                            done 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                        />
                        <StatusStep 
                            title="Processing" 
                            active
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 11a8.1 8.1 0 00-15.5-2 8.1 8.1 0 00-2.5 15.5" /></svg>}
                        />
                        <StatusStep 
                            title="Shipped" 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17l6-6-6-6" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2V9a2 2 0 00-2-2h-2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" /></svg>}
                        />
                        <StatusStep 
                            title="Delivered" 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" /></svg>}
                        />
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Details */}
                <div className="bg-base-100 p-6 sm:p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                        {order.items.map(item => (
                            <div key={item.id} className="flex items-center gap-4">
                                <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover rounded-md"/>
                                <div className="flex-grow">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="border-t my-4"></div>
                    <div className="flex justify-between font-bold text-xl">
                        <span>Total Paid</span>
                        <span className="text-primary">₹{order.total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-base-100 p-6 sm:p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
                    <div className="space-y-2 text-gray-700">
                        <p><span className="font-semibold">Name:</span> {order.shippingInfo.name}</p>
                        <p><span className="font-semibold">Address:</span> {order.shippingInfo.address}</p>
                        <p><span className="font-semibold">Phone:</span> {order.shippingInfo.phone}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-center gap-4 mt-4">
                <Link to="/" className="btn bg-secondary text-white hover:bg-secondary-focus font-bold py-3 px-8 rounded-full">
                    Continue Shopping
                </Link>
                <Link to="/orders" className="btn bg-primary text-white hover:bg-primary-focus font-bold py-3 px-8 rounded-full">
                    View My Orders
                </Link>
            </div>
        </div>
    );
};

export default OrderSummaryPage;