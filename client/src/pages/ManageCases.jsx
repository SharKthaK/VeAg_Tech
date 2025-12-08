import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import withSubscription from '../components/withSubscription';
import axios from 'axios';

const ManageCases = ({ daysRemaining }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCases = async () => {
      if (!currentUser?.userId) {
        console.log('No currentUser.userId available yet');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching cases for user:', currentUser.userId);
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/cases/user/${currentUser.userId}`);
        console.log('Cases response:', response.data);
        setCases(response.data.cases || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching cases:', err);
        setError(err.response?.data?.error || 'Failed to load cases. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [currentUser]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[status] || statusClasses.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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

        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold text-veag-dark-green mb-2">Manage Cases</h2>
              <p className="text-gray-600">View and manage all your registered cases</p>
            </div>
            <button
              onClick={() => navigate('/register-case')}
              className="px-6 py-2 bg-veag-green text-white font-semibold rounded-lg hover:bg-veag-dark-green transition-colors"
            >
              + New Case
            </button>
          </div>
        </div>

        {/* Subscription Status Banner */}
        {daysRemaining && daysRemaining > 0 && (
          <div className="bg-veag-light-green border-2 border-veag-green rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-veag-green rounded-full animate-pulse"></div>
              <span className="text-veag-dark-green font-semibold">
                Active Subscription: {daysRemaining} days remaining
              </span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-veag-green border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Loading your cases...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <p className="text-red-600 text-lg">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-veag-green text-white font-semibold rounded-lg hover:bg-veag-dark-green transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && cases.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-veag-light-green flex items-center justify-center">
                <svg className="w-10 h-10 text-veag-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-veag-dark-green">No Cases Yet</h3>
              <p className="text-gray-600">You haven't registered any cases. Start by creating your first case!</p>
              <button
                onClick={() => navigate('/register-case')}
                className="mt-4 px-8 py-3 bg-veag-green text-white font-semibold rounded-lg hover:bg-veag-dark-green transition-colors"
              >
                Register First Case
              </button>
            </div>
          </div>
        )}

        {/* Cases Grid */}
        {!loading && !error && cases.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {cases.map((caseItem) => (
                <div
                  key={caseItem._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                  onClick={() => navigate(`/case/${caseItem.caseId}`)}
                >
                  {/* Case Image */}
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {caseItem.images && caseItem.images.length > 0 ? (
                      <img
                        src={caseItem.images[0].url}
                        alt={`${caseItem.cropName} case`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-veag-light-green">
                        <svg className="w-16 h-16 text-veag-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    )}
                    {/* Image Count Badge */}
                    {caseItem.images && caseItem.images.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {caseItem.images.length} photos
                      </div>
                    )}
                  </div>

                  {/* Case Details */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-veag-dark-green mb-1">
                          Case #{caseItem.caseId}
                        </h3>
                        <p className="text-sm text-gray-500">{formatDate(caseItem.createdAt)}</p>
                      </div>
                      {getStatusBadge(caseItem.status)}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-veag-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                        </svg>
                        <span className="font-semibold text-gray-800">
                          {caseItem.cropName
                            ? caseItem.cropName.charAt(0).toUpperCase() + caseItem.cropName.slice(1)
                            : ""}
                        </span>

                      </div>
                      {caseItem.diseaseObservation && (
                        <p className="text-sm text-gray-600">
                          {caseItem.diseaseObservation
                            .split(" ")
                            .slice(0, 5)
                            .join(" ") + "..."}
                        </p>
                      )}
                    </div>
                    <button className="w-full px-4 py-2 bg-veag-light-green text-veag-dark-green font-semibold rounded-lg hover:bg-veag-green hover:text-white transition-colors">
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cases Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-veag-dark-green mb-4">Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-veag-green">{cases.length}</p>
                  <p className="text-sm text-gray-600">Total Cases</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-600">
                    {cases.filter(c => c.status === 'pending').length}
                  </p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {cases.filter(c => c.status === 'processing').length}
                  </p>
                  <p className="text-sm text-gray-600">Processing</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {cases.filter(c => c.status === 'completed').length}
                  </p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default withSubscription(ManageCases);
