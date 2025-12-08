import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

const NotFound = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  // Auto-redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {currentUser && <Header currentUser={currentUser} logout={logout} navigate={navigate} />}

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="flex flex-col items-center gap-6">
            {/* 404 Icon */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-6xl font-bold text-gray-300">404</span>
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-3">Page Not Found</h1>
              <p className="text-lg text-gray-600 mb-2">
                Oops! The page you're looking for doesn't exist.
              </p>
              <p className="text-sm text-gray-500">
                It might have been moved or deleted, or you may have typed the URL incorrectly.
              </p>
            </div>

            {/* Auto-redirect Notice */}
            <div className="bg-veag-light-green border-2 border-veag-green rounded-lg p-4 w-full">
              <p className="text-veag-dark-green text-sm">
                <span className="font-semibold">Redirecting to Dashboard</span> in 5 seconds...
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-8 py-3 bg-veag-green text-white font-semibold rounded-lg hover:bg-veag-dark-green transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex-1 px-8 py-3 border-2 border-veag-green text-veag-green font-semibold rounded-lg hover:bg-veag-green hover:text-white transition-colors"
              >
                Go Back
              </button>
            </div>

            {/* Helpful Links */}
            <div className="pt-6 border-t border-gray-200 w-full">
              <p className="text-sm text-gray-600 mb-3">Quick Links:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => navigate('/register-case')}
                  className="text-sm text-veag-green hover:text-veag-dark-green font-semibold transition-colors"
                >
                  Register Case
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => navigate('/manage-cases')}
                  className="text-sm text-veag-green hover:text-veag-dark-green font-semibold transition-colors"
                >
                  Manage Cases
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => navigate('/edit-profile')}
                  className="text-sm text-veag-green hover:text-veag-dark-green font-semibold transition-colors"
                >
                    Edit Profile
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => navigate('/manage-subscription')}
                  className="text-sm text-veag-green hover:text-veag-dark-green font-semibold transition-colors"
                >
                  Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
