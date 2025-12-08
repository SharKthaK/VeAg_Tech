import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const EditProfile = () => {
  const navigate = useNavigate();
  const { currentUser, updateUserName } = useAuth();
  const [name, setName] = useState(currentUser?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [nameHistory, setNameHistory] = useState([]);
  const [profileImageLoaded, setProfileImageLoaded] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);

  useEffect(() => {
    fetchNameHistory();
  }, []);

  useEffect(() => {
    setProfileImageLoaded(false);
    setProfileImageError(false);
  }, [currentUser?.photoURL]);

  const fetchNameHistory = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/${currentUser.userId}/name-history`
      );
      setNameHistory(response.data.history);
    } catch (error) {
      console.error('Error fetching name history:', error);
    }
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    
    if (name.trim() === currentUser?.name) {
      setMessage('No changes made');
      return;
    }

    if (name.trim().length < 2) {
      setMessage('Name must be at least 2 characters');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/${currentUser.userId}`,
        { name: name.trim() }
      );

      // Update name in context
      if (updateUserName) {
        updateUserName(name.trim());
      }

      setMessage('Name updated successfully!');
      setIsEditing(false);
      
      // Refresh name history
      fetchNameHistory();
    } catch (error) {
      console.error('Error updating name:', error);
      setMessage('Failed to update name. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(currentUser?.name || '');
    setIsEditing(false);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-veag-light-green via-white to-veag-light-green">
      <Header />

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
          <button
            onClick={() => navigate('/dashboard')}
            className="mb-6 text-veag-green hover:text-veag-dark-green flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h2 className="text-3xl font-bold text-veag-dark-green mb-6">Edit Profile</h2>
          
          {message && (
            <div className={`mb-4 p-3 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {message}
            </div>
          )}
          
          <div className="space-y-6">
            <div className="flex justify-center mb-6">
              {currentUser?.photoURL && !profileImageError ? (
                <div className="relative w-32 h-32">
                  {!profileImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-veag-light-green rounded-full">
                      <div className="w-16 h-16 border-4 border-veag-green border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img 
                    src={currentUser.photoURL} 
                    alt="Profile" 
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    className={`w-32 h-32 rounded-full border-4 border-veag-green object-cover transition-opacity duration-200 ${profileImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setProfileImageLoaded(true)}
                    onError={() => setProfileImageError(true)}
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-veag-green bg-white flex items-center justify-center">
                  <span className="text-veag-dark-green font-bold text-5xl">{currentUser?.name?.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            
            <form onSubmit={handleUpdateName}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing || loading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-veag-green focus:border-transparent disabled:bg-gray-50"
                  />
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-veag-green text-white font-semibold rounded-lg hover:bg-veag-dark-green transition-all duration-300"
                    >
                      Edit
                    </button>
                  ) : (
                    <>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-veag-green text-white font-semibold rounded-lg hover:bg-veag-dark-green transition-all duration-300 disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-all duration-300 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </form>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                value={currentUser?.email || ''} 
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
              <input 
                type="text" 
                value={currentUser?.userId || ''} 
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            
            {nameHistory.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-veag-dark-green mb-4">Name Change History</h3>
                <div className="space-y-3">
                  {nameHistory.map((history, index) => (
                    <div key={index} className="p-4 bg-veag-light-green rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">From:</span> {history.oldName}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">To:</span> {history.newName}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(history.changedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
