import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import Header from '../components/Header';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function ManageSubscription() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  // State for subscription data
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);

  // State for purchase
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // State for history
  const [transactions, setTransactions] = useState([]);
  const [subscriptionHistory, setSubscriptionHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Plan configuration
  const PLAN = {
    name: 'Premium Plan',
    basePrice: 10,
    discount: 10,
    finalPrice: 9,
    maxMonths: 12,
    minMonths: 1
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch subscription data
  useEffect(() => {
    if (currentUser) {
      fetchActiveSubscription();
      fetchTransactionHistory();
      fetchSubscriptionHistory();
    }
  }, [currentUser]);

  const fetchActiveSubscription = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriptions/${currentUser.userId}/active`);
      setHasActivePlan(response.data.hasActivePlan);
      setActiveSubscription(response.data.subscription);
      setDaysRemaining(response.data.subscription?.daysRemaining || 0);
    } catch (error) {
      console.error('Error fetching active subscription:', error);
    }
  };

  const fetchTransactionHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriptions/${currentUser.userId}/transactions`);
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchSubscriptionHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriptions/${currentUser.userId}/history`);
      setSubscriptionHistory(response.data.subscriptions);
    } catch (error) {
      console.error('Error fetching subscription history:', error);
    }
  };

  const calculateTotal = () => {
    return PLAN.finalPrice * selectedMonths;
  };

  const handlePurchase = async () => {
    if (selectedMonths < PLAN.minMonths || selectedMonths > PLAN.maxMonths) {
      alert(`Please select between ${PLAN.minMonths} to ${PLAN.maxMonths} months`);
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const orderResponse = await axios.post(`${API_BASE_URL}/subscriptions/create-order`, {
        userId: currentUser.userId,
        userEmail: currentUser.email,
        months: selectedMonths
      });

      const { orderId, amount, currency, key } = orderResponse.data;

      // Configure Razorpay options
      const options = {
        key,
        amount,
        currency,
        name: 'VeAg',
        description: `${PLAN.name} - ${selectedMonths} Month${selectedMonths > 1 ? 's' : ''}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await axios.post(`${API_BASE_URL}/subscriptions/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: currentUser.userId
            });

            if (verifyResponse.data.success) {
              alert('Payment successful! Your subscription has been activated.');
              // Refresh data
              fetchActiveSubscription();
              fetchTransactionHistory();
              fetchSubscriptionHistory();
              setSelectedMonths(1);
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: currentUser.name,
          email: currentUser.email
        },
        theme: {
          color: '#10b981'
        },
        modal: {
          ondismiss: async () => {
            // Handle payment cancellation
            await axios.post(`${API_BASE_URL}/subscriptions/payment-failure`, {
              razorpay_order_id: orderId,
              error: { description: 'Payment cancelled by user' }
            });
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Failed to initiate payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-veag-light-green via-white to-veag-light-green">
      <Header currentUser={currentUser} logout={logout} navigate={navigate} />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center gap-2 text-veag-green hover:text-veag-dark-green font-semibold transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Dashboard
        </button>

        {/* Subscription Days Banner - Only show if active */}
        {hasActivePlan && daysRemaining > 0 && (
          <div className="bg-veag-green text-white rounded-lg p-4 mb-6 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="font-semibold text-lg">
                ✨ Active Premium Subscription
              </span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{daysRemaining}</div>
              <div className="text-sm opacity-90">Days Remaining</div>
            </div>
          </div>
        )}

        {/* Active Subscription Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-veag-dark-green mb-4">Current Subscription Status</h2>
          {hasActivePlan && daysRemaining > 0 ? (
            <div className="bg-veag-light-green rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-veag-dark-green">{PLAN.name}</h3>
                  <p className="text-veag-dark-green">Active Subscription</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-veag-green">{daysRemaining}</div>
                  <div className="text-sm text-veag-dark-green">Days Remaining</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-veag-dark-green font-semibold">Start Date:</span>
                  <span className="ml-2">{formatDate(activeSubscription.startDate)}</span>
                </div>
                <div>
                  <span className="text-veag-dark-green font-semibold">End Date:</span>
                  <span className="ml-2">{formatDate(activeSubscription.endDate)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-2">No active subscription</p>
              <p className="text-sm text-gray-500">Purchase a plan to get started</p>
            </div>
          )}
        </div>

        {/* Purchase Plan */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-veag-dark-green mb-4">
            {hasActivePlan ? 'Extend Your Plan' : 'Purchase Premium Plan'}
          </h2>
          
          <div className="bg-veag-light-green rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-veag-dark-green">{PLAN.name}</h3>
                <p className="text-veag-dark-green">Unlimited access to all features</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 line-through">₹{PLAN.basePrice}/month</div>
                <div className="text-2xl font-bold text-veag-green">₹{PLAN.finalPrice}/month</div>
                <div className="text-xs text-veag-dark-green">{PLAN.discount}% OFF</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-veag-dark-green font-semibold mb-2">
              Select Duration (1-{PLAN.maxMonths} months)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min={PLAN.minMonths}
                max={PLAN.maxMonths}
                value={selectedMonths}
                onChange={(e) => setSelectedMonths(Math.max(PLAN.minMonths, Math.min(PLAN.maxMonths, parseInt(e.target.value) || PLAN.minMonths)))}
                className="w-32 px-4 py-2 border-2 border-veag-green rounded-lg focus:outline-none focus:ring-2 focus:ring-veag-green"
              />
              <div className="flex-1 text-right">
                <div className="text-sm text-gray-600">Total Amount</div>
                <div className="text-3xl font-bold text-veag-green">₹{calculateTotal()}</div>
              </div>
            </div>
          </div>

          <button
            onClick={handlePurchase}
            disabled={isProcessing}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
              isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-veag-green hover:bg-veag-dark-green'
            }`}
          >
            {isProcessing ? 'Processing...' : hasActivePlan ? 'Extend Plan' : 'Purchase Plan'}
          </button>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-veag-dark-green">Transaction History</h2>
            <button
              onClick={() => {
                setLoadingHistory(true);
                fetchTransactionHistory();
              }}
              disabled={loadingHistory}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                loadingHistory
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-veag-green text-white hover:bg-veag-dark-green'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${loadingHistory ? 'animate-spin' : ''}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              {loadingHistory ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          {loadingHistory ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-veag-green border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-veag-light-green">
                  <tr>
                    <th className="px-4 py-3 text-left text-veag-dark-green font-semibold">Date & Time</th>
                    <th className="px-4 py-3 text-left text-veag-dark-green font-semibold">Order ID</th>
                    <th className="px-4 py-3 text-left text-veag-dark-green font-semibold">Transaction ID</th>
                    <th className="px-4 py-3 text-left text-veag-dark-green font-semibold">Months</th>
                    <th className="px-4 py-3 text-left text-veag-dark-green font-semibold">Amount</th>
                    <th className="px-4 py-3 text-left text-veag-dark-green font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{formatDate(transaction.createdAt)}</td>
                      <td className="px-4 py-3 font-mono text-xs">{transaction.orderId}</td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {transaction.razorpayPaymentId || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm">{transaction.monthsPurchased}</td>
                      <td className="px-4 py-3 text-sm font-semibold">₹{transaction.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(transaction.status)}`}>
                          {transaction.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No transactions found
            </div>
          )}
        </div>

        {/* Plan History Timeline */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-veag-dark-green mb-4">Plan History</h2>
          {subscriptionHistory.length > 0 ? (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-veag-green"></div>
              
              <div className="space-y-6">
                {subscriptionHistory.map((sub, index) => (
                  <div key={sub._id} className="relative pl-16">
                    {/* Timeline dot */}
                    <div className={`absolute left-4 w-5 h-5 rounded-full border-4 ${
                      sub.isActive ? 'bg-veag-green border-veag-green' : 'bg-white border-veag-green'
                    }`}></div>
                    
                    {/* Content card */}
                    <div className={`rounded-lg p-4 ${
                      sub.isActive ? 'bg-veag-light-green border-2 border-veag-green' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-veag-dark-green">
                            {sub.purchaseType === 'new' ? '🎉 New Plan Purchased' : '⏱️ Plan Extended'}
                          </h3>
                          <p className="text-sm text-gray-600">{formatDate(sub.createdAt)}</p>
                        </div>
                        {sub.isActive && !sub.isExpired && (
                          <span className="px-3 py-1 bg-veag-green text-white text-xs font-semibold rounded-full">
                            ACTIVE
                          </span>
                        )}
                        {sub.isExpired && (
                          <span className="px-3 py-1 bg-gray-400 text-white text-xs font-semibold rounded-full">
                            EXPIRED
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Duration:</span>
                          <span className="ml-2 font-semibold">{sub.monthsPurchased} month{sub.monthsPurchased > 1 ? 's' : ''}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Amount:</span>
                          <span className="ml-2 font-semibold">₹{sub.amountPaid}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Start:</span>
                          <span className="ml-2">{new Date(sub.startDate).toLocaleDateString('en-IN')}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">End:</span>
                          <span className="ml-2">{new Date(sub.endDate).toLocaleDateString('en-IN')}</span>
                        </div>
                      </div>
                      {sub.isActive && !sub.isExpired && (
                        <div className="mt-2 pt-2 border-t border-veag-green">
                          <span className="text-sm font-semibold text-veag-dark-green">
                            {sub.daysRemaining} days remaining
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-600 mb-2">No plan history found</p>
              <p className="text-sm text-gray-500">Purchase your first plan to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageSubscription;
