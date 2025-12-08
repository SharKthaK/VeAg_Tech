import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [currentUser?.photoURL]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const navigationButtons = [
    {
      title: 'Register New Case',
      path: '/register-case',
      icon: '📝',
      gradient: 'from-veag-green to-veag-dark-green'
    },
    {
      title: 'Manage Old Cases',
      path: '/manage-cases',
      icon: '📂',
      gradient: 'from-veag-dark-green to-veag-green'
    },
    {
      title: 'Edit Profile',
      path: '/edit-profile',
      icon: '👤',
      gradient: 'from-veag-green to-veag-dark-green'
    },
    {
      title: 'Manage Subscription',
      path: '/manage-subscription',
      icon: '💳',
      gradient: 'from-veag-dark-green to-veag-green'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-veag-light-green via-white to-veag-light-green">
      {/* Header */}
      <div className="bg-gradient-to-r from-veag-dark-green to-veag-green shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">VeAg</h1>
            <div className="flex items-center gap-6">
              {currentUser?.photoURL && !imageError ? (
                <div className="relative w-10 h-10">
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-veag-light-green rounded-full">
                      <div className="w-6 h-6 border-3 border-veag-dark-green border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img 
                    src={currentUser.photoURL} 
                    alt="Profile" 
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    className={`w-10 h-10 rounded-full border-2 border-white object-cover transition-opacity duration-200 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full border-2 border-white bg-white flex items-center justify-center">
                  <span className="text-veag-dark-green font-bold text-lg">{currentUser?.name?.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <span className="text-white font-medium">{currentUser?.name}</span>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-white text-veag-dark-green font-semibold rounded-lg hover:bg-veag-light-green transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-veag-dark-green mb-12 text-center">
            Dashboard
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {navigationButtons.map((button, index) => (
              <button
                key={index}
                onClick={() => navigate(button.path)}
                className={`p-8 bg-gradient-to-br ${button.gradient} text-white rounded-2xl shadow-xl hover:scale-105 transition-all duration-300`}
              >
                <div className="text-5xl mb-4">{button.icon}</div>
                <div className="text-2xl font-semibold">{button.title}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
