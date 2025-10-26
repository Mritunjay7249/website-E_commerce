import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import useLocalStorage from '../hooks/useLocalStorage';
import { Order, CartItem } from '../types';
import BackButton from '../components/BackButton';

const PaymentOption: React.FC<{ id: string; name: string; icon: React.ReactNode; selected: boolean; onSelect: () => void; }> = ({ id, name, icon, selected, onSelect }) => (
    <label htmlFor={id} className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${selected ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-300' : 'border-gray-300 hover:bg-gray-50'}`}>
        <input type="radio" id={id} name="payment" className="hidden" checked={selected} onChange={onSelect} />
        <div className="mr-3 text-primary">{icon}</div>
        <span className="font-semibold">{name}</span>
    </label>
);

const CheckoutStep: React.FC<{ title: string; number: number; active: boolean; done: boolean }> = ({ title, number, active, done }) => (
    <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg ${done ? 'bg-success text-white' : active ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
            {done ? '✓' : number}
        </div>
        <span className={`ml-3 font-semibold ${active || done ? 'text-primary' : 'text-gray-500'}`}>{title}</span>
    </div>
);


const CheckoutPage: React.FC = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', []);
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    phone: '',
  });

  // Determine if this is a "Buy Now" flow or a standard cart checkout
  const buyNowItem = location.state?.buyNowItem as CartItem | undefined;
  
  const itemsToCheckout = useMemo(() => (buyNowItem ? [buyNowItem] : cartItems), [buyNowItem, cartItems]);
  const orderTotal = useMemo(() => {
    if (buyNowItem) {
      return buyNowItem.price * buyNowItem.quantity;
    }
    return getCartTotal();
  }, [buyNowItem, getCartTotal]);
  
  const upiId = 'dmritunjay871@okicic';
  const payeeName = 'Mritunjay D';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${orderTotal.toFixed(2)}&tn=ShopSphere%20Order`;


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shippingInfo.name && shippingInfo.address && shippingInfo.phone) {
        setStep(2);
        window.scrollTo(0, 0);
    } else {
        alert("Please fill in all shipping fields.");
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
        const newOrder: Order = {
          id: new Date().getTime().toString(),
          items: itemsToCheckout.map(item => ({
            id: item.id,
            name: item.name,
            images: item.images,
            price: item.price,
            quantity: item.quantity,
            sellerEmail: item.sellerEmail,
          })),
          total: orderTotal,
          date: new Date().toISOString(),
          shippingInfo,
        };
        setOrders([...orders, newOrder]);
        
        // Only clear the main cart if it's not a "Buy Now" checkout
        if (!buyNowItem) {
          clearCart();
        }
        
        setIsProcessing(false);
        navigate('/order-summary', { state: { orderId: newOrder.id }});
    }, 2000); // Simulate 2 second processing time
  };

  if (itemsToCheckout.length === 0 && !isProcessing) {
     return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Your Checkout is Empty</h1>
        <p className="text-gray-500 mb-8">There are no items to check out.</p>
        <Link to="/" className="btn bg-primary text-white hover:bg-primary-focus font-bold py-3 px-8 rounded-full">
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto relative">
      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-white"></div>
          <p className="text-white text-xl mt-4 font-semibold">Processing your order...</p>
        </div>
      )}
      <BackButton />
      <h1 className="text-4xl font-display font-bold mb-4 text-center">Checkout</h1>
      
      {/* Step Indicator */}
      <div className="flex justify-center items-center my-8">
        <CheckoutStep title="Shipping" number={1} active={step === 1} done={step > 1} />
        <div className="flex-grow h-1 mx-4 bg-gray-200 rounded-full">
            <div className={`h-1 rounded-full ${step > 1 ? 'bg-success' : 'bg-transparent'}`} style={{width: '100%'}}></div>
        </div>
        <CheckoutStep title="Payment & Review" number={2} active={step === 2} done={false} />
      </div>

      {/* Step 1: Shipping Information */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto bg-base-100 p-8 rounded-lg shadow-lg animate-fade-in">
            <form onSubmit={handleShippingSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">1. Shipping Information</h2>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" value={shippingInfo.name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="address">Address</label>
                <input type="text" id="address" name="address" value={shippingInfo.address} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" value={shippingInfo.phone} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" required />
              </div>
               <button type="submit" className="w-full mt-6 btn bg-secondary text-white hover:bg-secondary-focus font-bold py-3 rounded-full text-lg">
                  Continue to Payment
              </button>
            </form>
        </div>
      )}

      {/* Step 2: Payment and Order Review */}
      {step === 2 && (
        <form onSubmit={handlePlaceOrder} className="animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 bg-base-100 p-8 rounded-lg shadow-lg">
              {/* Review Details */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Review Order Details</h2>
                <div className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">Shipping To:</h3>
                        <button type="button" onClick={() => setStep(1)} className="text-sm text-blue-600 hover:underline">Change</button>
                    </div>
                    <p className="text-gray-700">{shippingInfo.name}</p>
                    <p className="text-gray-700">{shippingInfo.address}</p>
                    <p className="text-gray-700">{shippingInfo.phone}</p>
                </div>
              </div>
               {/* Payment Method */}
              <div className="mt-8">
                <h3 className="text-2xl font-bold mb-4">2. Payment Method</h3>
                <p className="text-sm text-gray-500 mb-4">This is a simulated payment process. No real transaction will occur.</p>
                <div className="space-y-3">
                    <PaymentOption id="credit-card" name="Credit Card" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>} selected={paymentMethod === 'credit-card'} onSelect={() => setPaymentMethod('credit-card')} />
                    <PaymentOption id="paypal" name="PayPal" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10.42.42a1.44 1.44 0 00-1.28.6L5.58 8.15a.82.82 0 00.32.93l4.7 2.7c.36.2.78.2 1.14 0l4.7-2.7a.82.82 0 00.32-.93L13.19 1a1.44 1.44 0 00-1.28-.6h-.2a1.43 1.43 0 00-1.29.02zM6.9 9.7L4.5 4.96a.82.82 0 01.32-.93l2.4-1.38v7.05zm8.82-5.67l2.4 1.38a.82.82 0 01.32.93L16 9.7V4.03zM4.92 11.23l-2.4 1.38a.82.82 0 00-.32.93l3.56 7.13a1.44 1.44 0 001.28.6h.21a1.44 1.44 0 001.28-.6l3.56-7.13a.82.82 0 00-.32-.93l-4.7-2.7a1.46 1.46 0 00-1.14 0l-1.11.63zm13 2.3l-2.4-1.38-.28-.16-1.12.64-4.7 2.7a.82.82 0 00-.32.93l3.56 7.13a1.44 1.44 0 001.28.6h.2a1.44 1.44 0 001.28-.6l3.56-7.13a.82.82 0 00-.32-.93z"/></svg>} selected={paymentMethod === 'paypal'} onSelect={() => setPaymentMethod('paypal')} />
                    <PaymentOption id="upi" name="UPI / QR Code" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /><path d="M3 3h3v3H3zM18 3h3v3h-3zM3 18h3v3H3zM18 18h3v3h-3z"/></svg>} selected={paymentMethod === 'upi'} onSelect={() => setPaymentMethod('upi')} />
                </div>
                {paymentMethod === 'upi' && (
                  <div className="mt-4 p-4 border-2 border-dashed rounded-lg bg-blue-50 animate-fade-in">
                    <h3 className="font-semibold text-lg text-center mb-2">Pay with UPI</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <img src={qrCodeUrl} alt="UPI QR Code" className="rounded-md" />
                      <div className="text-center sm:text-left">
                        <p className="font-medium">Scan the QR code with your UPI app.</p>
                        <p className="text-gray-700 mt-2">Or pay to UPI ID:</p>
                        <p className="font-mono bg-gray-200 p-2 rounded-md mt-1 inline-block">{upiId}</p>
                        <p className="font-bold mt-2">Amount: ₹{orderTotal.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2 bg-base-100 p-8 rounded-lg shadow-lg h-fit sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {itemsToCheckout.map(item => (
                  <div key={item.id} className="flex justify-between items-start gap-2">
                    <img src={item.images[0]} alt={item.name} className="w-12 h-12 object-cover rounded-md"/>
                    <span className="flex-grow text-sm">{item.name} <span className="text-gray-500">x {item.quantity}</span></span>
                    <span className="font-medium text-sm">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t my-4"></div>
              <div className="flex justify-between font-bold text-xl">
                <span>Order Total</span>
                <span className="text-primary">₹{orderTotal.toFixed(2)}</span>
              </div>
              <button type="submit" className="w-full mt-8 btn bg-success text-white hover:bg-green-600 font-bold py-3 rounded-full text-lg" disabled={isProcessing}>
                {isProcessing ? 'Processing...' : `Place Order`}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default CheckoutPage;