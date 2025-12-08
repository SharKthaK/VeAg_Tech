import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import withSubscription from '../components/withSubscription';

const ManageCases = ({ daysRemaining }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  console.log('ManageCases - daysRemaining:', daysRemaining);

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

        {/* Manage Cases Content - Placeholder */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-veag-dark-green mb-6">Manage Old Cases</h2>
          
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📁</div>
            <p className="text-xl text-veag-dark-green font-semibold mb-2">
              Case Management Dashboard
            </p>
            <p className="text-gray-600 mb-6">
              This is a placeholder. The case management features will be implemented here.
            </p>
            <div className="inline-block bg-veag-light-green border-2 border-veag-green rounded-lg px-6 py-3">
              <p className="text-veag-dark-green font-semibold">
                Ready for your content!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withSubscription(ManageCases);
