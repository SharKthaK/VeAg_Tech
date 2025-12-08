import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Higher-Order Component to protect routes that require active subscription
export const withSubscription = (Component) => {
  return function ProtectedComponent(props) {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [isChecking, setIsChecking] = useState(true);
    const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
    const [daysRemaining, setDaysRemaining] = useState(0);

    useEffect(() => {
      const checkSubscription = async () => {
        if (!currentUser) {
          navigate('/login');
          return;
        }

        try {
          const response = await axios.get(
            `${API_BASE_URL}/subscriptions/${currentUser.userId}/active`
          );

          console.log('Subscription response:', response.data);

          const hasActivePlan = response.data.hasActivePlan;
          const days = response.data.subscription?.daysRemaining || 0;

          // Only set as active if both conditions are true
          const isActive = hasActivePlan === true && days > 0;
          
          setHasActiveSubscription(isActive);
          setDaysRemaining(days); // Always set the days value
          
          console.log('Has active plan:', hasActivePlan, 'Days:', days, 'Is Active:', isActive);
        } catch (error) {
          console.error('Error checking subscription:', error);
          setHasActiveSubscription(false);
          setDaysRemaining(0);
        } finally {
          setIsChecking(false);
        }
      };

      checkSubscription();
    }, [currentUser, navigate]);

    if (isChecking) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-veag-light-green via-white to-veag-light-green flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-veag-green border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-veag-dark-green font-semibold">Checking subscription...</p>
          </div>
        </div>
      );
    }

    if (!hasActiveSubscription) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-veag-light-green via-white to-veag-light-green flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="text-6xl mb-6">😞</div>
            <h2 className="text-3xl font-bold text-veag-dark-green mb-4">
              Oops! No Active Subscription
            </h2>
            <p className="text-gray-600 mb-6">
              You need an active subscription to access this feature. 
              Please purchase or extend your subscription to continue.
            </p>
            <div className="bg-veag-light-green rounded-lg p-4 mb-6">
              <p className="text-veag-dark-green font-semibold">
                Get Premium Access
              </p>
              <p className="text-sm text-veag-dark-green">
                Starting at just ₹9/month
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/manage-subscription')}
                className="w-full bg-veag-green text-white py-3 rounded-lg font-semibold hover:bg-veag-dark-green transition-colors"
              >
                Get Subscription
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gray-100 text-veag-dark-green py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    console.log('withSubscription - Rendering component with daysRemaining:', daysRemaining);
    return <Component {...props} daysRemaining={daysRemaining} />;
  };
};

export default withSubscription;
