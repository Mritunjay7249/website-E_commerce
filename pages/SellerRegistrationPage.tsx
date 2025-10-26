import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Feature: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 text-primary">{icon}</div>
    <div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);


const SellerRegistrationPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleGetStarted = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            navigate('/auth', { state: { email, role: 'seller', fromSellerPage: true } });
        }
    };

    return (
        <div className="bg-white">
            <header className="border-b">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl lg:text-3xl font-bold font-display text-primary">
                        ShopSphere <span className="text-secondary font-medium">Business</span>
                    </Link>
                    <div className="flex items-center gap-6 font-semibold text-sm">
                        <div className="flex items-center gap-2 text-primary">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white font-bold">1</span>
                            <span>ACCOUNT CREATION</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                             <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-400 font-bold">2</span>
                            <span>BUSINESS DETAILS</span>
                        </div>
                         <div className="flex items-center gap-2 text-gray-400">
                             <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-400 font-bold">3</span>
                            <span>FINISH</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Left Panel */}
                    <div className="p-8 border rounded-lg shadow-sm bg-base-100">
                        <h1 className="text-3xl font-display font-bold mb-2">Let us create your free ShopSphere Business account</h1>
                        <p className="text-gray-600 mb-6">Enter an email. Work email preferred.</p>
                        <form onSubmit={handleGetStarted} className="space-y-4">
                             <div>
                                <label htmlFor="email" className="text-sm font-semibold text-gray-700 sr-only">Email address</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter email address"
                                    required
                                    className="w-full mt-1 px-4 py-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-focus focus:border-primary-focus"
                                    autoFocus
                                />
                            </div>
                            <button type="submit" className="w-full py-3 px-4 bg-primary hover:bg-primary-focus text-white font-bold rounded-md shadow-sm text-lg">
                                Get started
                            </button>
                        </form>
                        <p className="text-sm text-gray-600 mt-4">
                            Already a ShopSphere Business customer? <Link to="/auth" className="text-blue-600 hover:underline">Sign in</Link>
                        </p>
                    </div>

                    {/* Right Panel */}
                    <div className="p-8">
                         <h2 className="text-3xl font-display font-bold mb-6">Reshape selling for your organisation</h2>
                         <div className="space-y-6">
                            <Feature
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                                title="Powerful Seller Tools"
                                description="Get access to our full suite of tools to list products, manage inventory, and fulfill orders."
                            />
                            <Feature
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                                title="Secure & Fast Payments"
                                description="Benefit from secure transactions and get your payments processed quickly and reliably."
                            />
                            <Feature
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                                title="Business Analytics"
                                description="Track and monitor your sales with our analytics dashboard to make informed decisions for your business."
                            />
                         </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SellerRegistrationPage;
