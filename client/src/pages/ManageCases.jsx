import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const ManageCases = () => {
  const navigate = useNavigate();

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
          <h2 className="text-3xl font-bold text-veag-dark-green mb-6">Manage Old Cases</h2>
          <p className="text-gray-600">This feature will be implemented soon.</p>
        </div>
      </div>
    </div>
  );
};

export default ManageCases;
