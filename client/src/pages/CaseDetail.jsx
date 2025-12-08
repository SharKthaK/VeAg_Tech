import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import withSubscription from '../components/withSubscription';
import axios from 'axios';

const CaseDetail = ({ daysRemaining }) => {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const { currentUser, logout } = useAuth();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchCaseDetail = async () => {
      if (!currentUser?.userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/cases/${caseId}`);
        
        // Security check: Verify case belongs to current user
        if (response.data.case.userId !== currentUser.userId) {
          console.warn('Unauthorized access attempt to case:', caseId);
          setUnauthorized(true);
        } else {
          setCaseData(response.data.case);
          setSelectedImage(response.data.case.images[0]?.url || null);
        }
      } catch (err) {
        console.error('Error fetching case:', err);
        if (err.response?.status === 404) {
          setUnauthorized(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetail();
  }, [caseId, currentUser]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Processing' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-veag-light-green via-white to-veag-light-green">
        <Header currentUser={currentUser} logout={logout} navigate={navigate} />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-veag-green border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Loading case details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Unauthorized Access
  if (unauthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
        <Header currentUser={currentUser} logout={logout} navigate={navigate} />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-red-600 mb-2">Unauthorized Access</h2>
                <p className="text-gray-600 text-lg mb-6">
                  You don't have permission to view this case.
                </p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-3 bg-veag-green text-white font-semibold rounded-lg hover:bg-veag-dark-green transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Case Detail View
  return (
    <div className="min-h-screen bg-gradient-to-br from-veag-light-green via-white to-veag-light-green">
      <Header currentUser={currentUser} logout={logout} navigate={navigate} />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/manage-cases')}
          className="mb-6 flex items-center gap-2 text-veag-green hover:text-veag-dark-green font-semibold transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Manage Cases
        </button>

        {/* Case Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-veag-dark-green mb-2">
                Case #{caseData.caseId}
              </h1>
              <p className="text-gray-600">{formatDate(caseData.createdAt)}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              {getStatusBadge(caseData.status)}
              <div className="bg-veag-light-green px-4 py-2 rounded-lg">
                <span className="text-sm text-veag-dark-green font-semibold">
                  Plan: {daysRemaining} days left
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-veag-dark-green mb-4">Images</h2>
              
              {/* Main Image Display */}
              {selectedImage && (
                <div className="mb-6 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={selectedImage}
                    alt="Selected case image"
                    className="w-full h-96 object-contain"
                  />
                </div>
              )}

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {caseData.images.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(image.url)}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-3 transition-all ${
                      selectedImage === image.url
                        ? 'border-veag-green ring-2 ring-veag-green'
                        : 'border-gray-200 hover:border-veag-green'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`Case image ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-1">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Case Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Crop Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-veag-dark-green mb-4">Crop Information</h3>
              <div className="flex items-center gap-3 p-4 bg-veag-light-green rounded-lg">
                <svg className="w-8 h-8 text-veag-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
                <div>
                  <p className="text-sm text-gray-600">Crop Type</p>
                  <p className="text-lg font-bold text-veag-dark-green capitalize">{caseData.cropName}</p>
                </div>
              </div>
            </div>

            {/* Disease Observation */}
            {caseData.diseaseObservation && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-veag-dark-green mb-4">Observation</h3>
                <p className="text-gray-700 leading-relaxed">{caseData.diseaseObservation}</p>
              </div>
            )}

            {/* Case Statistics */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-veag-dark-green mb-4">Case Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Total Images</span>
                  <span className="font-semibold text-veag-dark-green">{caseData.images.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Status</span>
                  <span className="font-semibold text-veag-dark-green capitalize">{caseData.status}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Case ID</span>
                  <span className="font-semibold text-veag-dark-green">{caseData.caseId}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-veag-dark-green mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/manage-cases')}
                  className="w-full px-4 py-3 bg-veag-light-green text-veag-dark-green font-semibold rounded-lg hover:bg-veag-green hover:text-white transition-colors"
                >
                  View All Cases
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full px-4 py-3 border-2 border-veag-green text-veag-green font-semibold rounded-lg hover:bg-veag-green hover:text-white transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withSubscription(CaseDetail);
