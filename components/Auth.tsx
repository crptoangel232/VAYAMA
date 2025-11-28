import React, { useState } from 'react';

interface AuthProps {
  onAuthSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle form submission, API calls, etc.
    // For this mock, we'll just call the success callback.
    onAuthSuccess();
  };

  return (
    <div className="bg-slate-50 dark:bg-black text-slate-800 dark:text-slate-200 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-500">VAYAMA</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Your AI Social Booking Super-App</p>
        </header>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-6">
            {isLoginView ? 'Welcome Back!' : 'Create Account'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginView && (
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-slate-500 dark:text-slate-400">Full Name</label>
                <input 
                  type="text" 
                  id="name"
                  placeholder="Alex Doe"
                  className="w-full mt-1 p-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500 text-sm" 
                  required 
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-500 dark:text-slate-400">Email Address</label>
              <input 
                type="email" 
                id="email"
                placeholder="alex.doe@example.com"
                className="w-full mt-1 p-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500 text-sm" 
                required 
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-500 dark:text-slate-400">Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••"
                className="w-full mt-1 p-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500 text-sm" 
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition-colors text-sm"
            >
              {isLoginView ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
            {isLoginView ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLoginView(!isLoginView)}
              className="font-semibold text-blue-500 hover:text-blue-600 ml-1"
            >
              {isLoginView ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;