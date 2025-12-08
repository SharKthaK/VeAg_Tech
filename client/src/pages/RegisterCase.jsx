import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import Header from '../components/Header';
import withSubscription from '../components/withSubscription';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const RegisterCase = ({ daysRemaining }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  // Form state
  const [selectedCrop, setSelectedCrop] = useState('');
  const [crops, setCrops] = useState([]);
  const [loadingCrops, setLoadingCrops] = useState(true);
  const [symptomDescription, setSymptomDescription] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [createdCase, setCreatedCase] = useState(null);

  console.log('RegisterCase - daysRemaining:', daysRemaining);

  // Fetch crops from backend
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/crops`);
        setCrops(response.data.crops);
      } catch (error) {
        console.error('Error fetching crops:', error);
      } finally {
        setLoadingCrops(false);
      }
    };

    fetchCrops();
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Check if adding new images would exceed the limit
    if (uploadedImages.length + files.length > 10) {
      alert('Maximum 10 images can be uploaded');
      return;
    }
    
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setUploadedImages(prev => [...prev, ...imageUrls]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Convert image URL to base64
  const convertToBase64 = (url) => {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(reject);
    });
  };

  const handleSubmit = async () => {
    if (!selectedCrop || uploadedImages.length === 0) {
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);
    setProgressMessage('Preparing images...');
    setSubmissionError('');

    try {
      // Convert all images to base64
      setProgressMessage('Converting images...');
      const base64Images = [];
      for (let i = 0; i < uploadedImages.length; i++) {
        setUploadProgress(((i + 1) / uploadedImages.length) * 30);
        const base64 = await convertToBase64(uploadedImages[i]);
        base64Images.push(base64);
      }

      // Submit to backend
      setProgressMessage('Uploading to cloud storage...');
      setUploadProgress(40);

      const response = await axios.post(`${API_BASE_URL}/cases`, {
        userId: currentUser.userId,
        cropName: selectedCrop,
        diseaseObservation: symptomDescription,
        images: base64Images
      });

      setUploadProgress(100);
      setProgressMessage('Case created successfully!');
      
      if (response.data.success) {
        setCreatedCase(response.data.case);
        setSubmissionSuccess(true);
      } else {
        throw new Error(response.data.error || 'Failed to create case');
      }
    } catch (error) {
      console.error('Error submitting case:', error);
      setSubmissionError(error.response?.data?.error || error.message || 'Failed to create case. Please try again.');
      setUploadProgress(0);
      setProgressMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setSelectedCrop('');
    setSymptomDescription('');
    setUploadedImages([]);
    setSubmissionSuccess(false);
    setSubmissionError('');
    setCreatedCase(null);
    setUploadProgress(0);
    setProgressMessage('');
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

        {/* Register Case Form - Placeholder */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-veag-dark-green mb-6">Register New Case</h2>
          
          {/* Crop Selection Dropdown */}
          <div className="mb-8">
            <label className="block text-veag-dark-green font-semibold mb-3 text-lg">
              Select Crop <span className="text-red-500">*</span>
            </label>
            {loadingCrops ? (
              <div className="flex items-center gap-3 px-4 py-3 border-2 border-veag-green rounded-lg">
                <div className="w-5 h-5 border-3 border-veag-green border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">Loading crops...</span>
              </div>
            ) : (
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-4 py-3 border-2 border-veag-green rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-veag-green bg-white"
                required
              >
                <option value="">-- Select a crop --</option>
                {crops.map((crop) => (
                  <option key={crop._id} value={crop.name}>
                    {crop.displayName}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Form Section - Only show if crop is selected */}
          {selectedCrop && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Left Column: Image Upload */}
                <div className="flex flex-col items-center space-y-4">
                  <h3 className="text-lg font-semibold text-veag-dark-green self-start">
                    Upload Plant Images <span className="text-red-500">*</span>
                    <span className="text-sm text-gray-600 ml-2">({uploadedImages.length}/10)</span>
                  </h3>
                  
                  {/* Horizontal Scrollable Image Previews */}
                  <div className="w-full overflow-x-auto flex space-x-2 py-2">
                    {uploadedImages.length > 0 ? uploadedImages.map((src, index) => (
                      <div key={index} className="relative flex-shrink-0 w-20 h-20 border-2 border-veag-green rounded-lg bg-gray-50 flex items-center justify-center group">
                        <img src={src} alt={`preview ${index}`} className="h-full w-full object-cover rounded-md" />
                        {/* Delete button on hover */}
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                          type="button"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    )) : (
                      <div className="flex justify-center gap-2 w-full">
                        {Array(3).fill(null).map((_, index) => (
                          <div key={index} className="w-20 h-20 border-2 border-veag-green rounded-lg bg-veag-light-green flex items-center justify-center">
                            <span className="text-veag-dark-green text-xs">Empty</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                
                  <label htmlFor="photo-upload" className="w-full h-48 border-2 border-veag-green rounded-lg flex flex-col items-center justify-center text-veag-green cursor-pointer hover:bg-veag-light-green transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="mt-2 text-lg font-semibold">Upload Photos</span>
                    <span className="text-sm text-gray-600 mt-1">(Max 10 images)</span>
                  </label>
                  <input 
                    id="photo-upload" 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload}
                    disabled={uploadedImages.length >= 10}
                  />
                </div>

                {/* Right Column: Symptom Description */}
                <div className="flex flex-col h-full">
                  <h3 className="text-lg font-semibold text-veag-dark-green mb-4">
                    Disease Observation (Optional)
                  </h3>
                  <textarea
                    value={symptomDescription}
                    onChange={(e) => setSymptomDescription(e.target.value)}
                    placeholder="Describe any symptoms or problems you've observed in your crop..."
                    className="w-full flex-grow px-4 py-3 border-2 border-veag-green rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-veag-green resize-none"
                    rows="10"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!selectedCrop || uploadedImages.length === 0}
                  className={`px-10 py-3 font-bold text-lg rounded-lg transition-colors ${
                    selectedCrop && uploadedImages.length > 0
                      ? 'bg-veag-green text-white hover:bg-veag-dark-green'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Submit Case
                </button>
              </div>
            </>
          )}

          {/* Message when no crop selected */}
          {!selectedCrop && !loadingCrops && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">Please select a crop to continue</p>
            </div>
          )}
        </div>

        {/* Progress Modal */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-veag-green border-t-transparent rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-bold text-veag-dark-green mb-2">Submitting Case</h3>
                <p className="text-gray-600 mb-4 text-center">{progressMessage}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-veag-green h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">{uploadProgress}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {submissionSuccess && createdCase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Green Checkmark Animation */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-veag-green flex items-center justify-center animate-bounce">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-veag-dark-green mt-4 mb-2">Case Submitted Successfully!</h2>
                <p className="text-lg text-gray-600">Your case has been registered</p>
              </div>

              {/* Case Details */}
              <div className="bg-veag-light-green rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-veag-dark-green">Case ID</label>
                    <p className="text-xl font-bold text-veag-green">{createdCase.caseId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-veag-dark-green">Crop</label>
                    <p className="text-lg font-semibold text-gray-800">
                      {createdCase.cropName
                        ? createdCase.cropName.charAt(0).toUpperCase() + createdCase.cropName.slice(1)
                        : ""
                      }
                    </p>
                  </div>
                  {createdCase.diseaseObservation && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-veag-dark-green">Disease Observation</label>
                      <p className="text-gray-700 mt-1">{createdCase.diseaseObservation}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Uploaded Images */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-veag-dark-green mb-3">
                  Uploaded Images ({createdCase.images.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {createdCase.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={`Case image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-veag-green"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 px-6 py-3 bg-veag-green text-white font-semibold rounded-lg hover:bg-veag-dark-green transition-colors"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => navigate('/manage-cases')}
                  className="flex-1 px-6 py-3 bg-veag-dark-green text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  View All Cases
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {submissionError && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">Submission Failed</h2>
                <p className="text-gray-600 text-center mb-6">{submissionError}</p>
                <button
                  onClick={() => setSubmissionError(null)}
                  className="px-6 py-3 bg-veag-green text-white font-semibold rounded-lg hover:bg-veag-dark-green transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withSubscription(RegisterCase);
