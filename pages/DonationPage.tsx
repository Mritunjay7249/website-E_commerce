import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import BackButton from '../components/BackButton';
import { Link } from 'react-router-dom';

const DonationPage: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [isDonated, setIsDonated] = useState(false);
  const { showToast } = useToast();
  const upiId = 'dmritunjay871@okicic';
  const payeeName = 'Mritunjay D';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}${amount ? `&am=${amount}` : ''}&tn=Donation%20to%20ShopSphere`;

  const handleDonate = () => {
    // Simulate donation confirmation
    showToast('Thank you for your generous donation!', 'success');
    setIsDonated(true);
  };

  if (isDonated) {
    return (
      <div className="max-w-lg mx-auto bg-base-100 p-8 rounded-lg shadow-lg text-center animate-fade-in">
         <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
          </div>
        <h1 className="text-3xl font-bold font-display text-success">Donation Received!</h1>
        <p className="text-gray-600 mt-4 mb-6">Thank you for your support. Your contribution helps us keep ShopSphere running.</p>
        <Link to="/" className="btn bg-primary text-white hover:bg-primary-focus">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <BackButton />
      <div className="bg-base-100 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-display font-bold mb-6 text-center text-primary">Make a Donation</h1>
        <div className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="mt-1 w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="text-center p-4 border-2 border-dashed rounded-lg">
            <h2 className="font-semibold text-lg mb-2">Scan to Pay with UPI</h2>
            <img src={qrCodeUrl} alt="UPI QR Code" className="mx-auto my-2 rounded-md" />
            <p className="text-gray-700">Or pay to UPI ID:</p>
            <p className="font-mono bg-gray-100 p-2 rounded-md mt-1 inline-block">{upiId}</p>
          </div>

          <button
            onClick={handleDonate}
            className="w-full btn bg-secondary text-white hover:bg-secondary-focus font-bold py-3 rounded-full text-lg"
          >
            I Have Donated
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;