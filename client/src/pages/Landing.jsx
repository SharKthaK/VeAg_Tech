import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-veag-dark-green via-veag-green to-veag-light-green flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-white mb-12 drop-shadow-2xl">
          VeAg
        </h1>
        <button
          onClick={() => navigate('/login')}
          className="px-12 py-4 bg-white text-veag-dark-green text-2xl font-semibold rounded-lg hover:bg-veag-light-green hover:scale-105 transition-all duration-300 shadow-2xl"
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default Landing;
