import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';

const AuthPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'seller'>('customer');
  const [error, setError] = useState('');
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Pre-fill form if redirected from seller registration page
    if (location.state?.fromSellerPage) {
      setEmail(location.state.email || '');
      setRole(location.state.role || 'seller');
      setIsLogin(false);
      setStep(2);
      // Clear the state so it doesn't persist on refresh or back navigation
      window.history.replaceState({}, document.title)
    }
  }, [location.state]);


  // A simple check against a pre-defined list of users for demonstration
  // In a real app, this would be an API call.
  const checkEmailExists = (emailToCheck: string): boolean => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      return users.some((u: User) => u.email === emailToCheck);
  }

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
        setError('Please enter your email.');
        return;
    }
    setError('');
    
    if (checkEmailExists(email)) {
        setIsLogin(true);
    } else {
        setIsLogin(false);
    }
    setStep(2);
  };

  const handleAuthAction = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const from = location.state?.from;

    const handleSuccess = (loggedInUser: User) => {
      // If we were redirected from a protected route, go back there.
      // Pass along any state that was with the original location (e.g., buyNowItem).
      if (from) {
        navigate(from.pathname, { replace: true, state: from.state });
      } else {
        // Otherwise, go to the default page for the user role.
        navigate(loggedInUser.role === 'seller' ? '/seller-dashboard' : '/');
      }
    };

    if (isLogin) {
      const loggedInUser = login(email, password);
      if (loggedInUser) {
        handleSuccess(loggedInUser);
      } else {
        setError("Invalid password. Please try again.");
      }
    } else {
      const newUser = signup(email, password, role);
      if (newUser) {
        handleSuccess(newUser);
      } else {
        setError("An account with this email already exists.");
      }
    }
  };
  
  const resetFlow = () => {
    setStep(1);
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-neutral pt-4 pb-12">
        <h1 className="text-4xl font-display font-bold text-primary mb-4">ShopSphere</h1>

        <div className="w-full max-w-sm">
            {error && <div className="p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">{error}</div>}

            <div className="bg-base-100 p-6 border border-gray-300 rounded-lg shadow-sm">
                {step === 1 && (
                    <form onSubmit={handleContinue} className="space-y-4">
                        <h2 className="text-2xl font-semibold">Sign in or create account</h2>
                        <div>
                            <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email address</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full mt-1 px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-focus focus:border-primary-focus"
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="w-full py-2.5 px-4 bg-secondary hover:bg-secondary-focus text-white font-semibold rounded-md shadow-sm">
                            Continue
                        </button>
                        <p className="text-xs text-gray-600">
                            By continuing, you agree to ShopSphere's <a href="#" className="text-blue-600 hover:underline">Conditions of Use</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Notice</a>.
                        </p>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleAuthAction} className="space-y-4">
                        <h2 className="text-2xl font-semibold">{isLogin ? 'Sign in' : 'Create account'}</h2>
                        <div className="text-sm">
                            <span>{email}</span>
                            <button type="button" onClick={resetFlow} className="ml-2 text-blue-600 hover:underline text-xs">Change</button>
                        </div>
                        <div>
                            <label htmlFor="password"className="text-sm font-semibold text-gray-700">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full mt-1 px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-focus focus:border-primary-focus"
                                autoFocus
                            />
                        </div>

                         {!isLogin && (
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-2 block">I am a...</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button type="button" onClick={() => setRole('customer')} className={`p-3 border rounded-lg text-center transition-colors ${role === 'customer' ? 'bg-primary text-white border-primary-focus ring-2 ring-primary-focus' : 'hover:bg-gray-100'}`}>
                                        Customer
                                    </button>
                                    <button type="button" onClick={() => setRole('seller')} className={`p-3 border rounded-lg text-center transition-colors ${role === 'seller' ? 'bg-primary text-white border-primary-focus ring-2 ring-primary-focus' : 'hover:bg-gray-100'}`}>
                                        Seller
                                    </button>
                                </div>
                            </div>
                        )}

                        <button type="submit" className="w-full py-2.5 px-4 bg-secondary hover:bg-secondary-focus text-white font-semibold rounded-md shadow-sm">
                            {isLogin ? 'Sign in' : 'Create Account'}
                        </button>
                    </form>
                )}

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Selling on ShopSphere?</span>
                    </div>
                </div>

                <Link to="/seller-signup" className="block text-center w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-md border border-gray-300 shadow-sm">
                    Create a free seller account
                </Link>
            </div>
        </div>

        <footer className="w-full max-w-5xl mx-auto mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-600">
            <div className="flex justify-center space-x-6">
                <a href="#" className="text-blue-600 hover:underline">Conditions of Use</a>
                <a href="#" className="text-blue-600 hover:underline">Privacy Notice</a>
                <a href="#" className="text-blue-600 hover:underline">Help</a>
            </div>
            <p className="mt-2">&copy; 1996–{new Date().getFullYear()}, ShopSphere.com, Inc. or its affiliates</p>
        </footer>
    </div>
  );
};

export default AuthPage;