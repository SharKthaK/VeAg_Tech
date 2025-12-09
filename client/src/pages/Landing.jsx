import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import veagLogo from '../assets/veag_logo.svg';

const Landing = () => {
  const navigate = useNavigate();

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-300 via-orange-200 to-yellow-100 overflow-hidden relative flex items-center justify-center">
      {/* Sky background with clouds */}
      <motion.div
        className="absolute top-12 left-12 w-32 h-16 bg-white rounded-full opacity-70 blur-xl"
        animate={{ x: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-24 right-20 w-40 h-20 bg-white rounded-full opacity-60 blur-xl"
        animate={{ x: [0, -40, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Mountains - Back Layer (Sunset Brown) */}
      <svg
        className="absolute bottom-0 left-0 w-full h-80 opacity-50"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#a0522d"
          d="M0,160L60,144C120,128,240,96,360,112C480,128,600,192,720,186.7C840,181,960,107,1080,96C1200,85,1320,139,1380,165.3L1440,192L1440,320L0,320Z"
        />
      </svg>

      {/* Mountains - Middle Layer (Burnt Orange) */}
      <svg
        className="absolute bottom-0 left-0 w-full h-64 opacity-70"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#d97706"
          d="M0,96L60,112C120,128,240,160,360,160C480,160,600,128,720,122.7C840,117,960,139,1080,144C1200,149,1320,139,1380,133.3L1440,128L1440,320L0,320Z"
        />
      </svg>

      {/* Grass at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-green-600 to-green-700 z-10" />

      {/* Detailed Grass */}
      <svg
        className="absolute bottom-24 left-0 w-full h-16"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        style={{ zIndex: 15 }}
      >
        <path
          fill="#22c55e"
          d="M0,20L20,25C40,30,80,40,120,38C160,36,200,20,240,22C280,24,320,40,360,42C400,44,440,32,480,28C520,24,560,28,600,30C640,32,680,32,720,30C760,28,800,24,840,26C880,28,920,36,960,38C1000,40,1040,36,1080,32C1120,28,1160,24,1200,26C1240,28,1280,36,1320,38C1360,40,1400,36,1440,34L1440,80L0,80Z"
        />
      </svg>

      {/* Trees - Left side (Fixed to ground) */}
      <div className="absolute bottom-24 left-10 z-20">
        <svg width="120" height="200" viewBox="0 0 60 100">
          {/* Tree trunk */}
          <rect x="24" y="70" width="12" height="30" fill="#8b4513" />
          {/* Tree foliage */}
          <circle cx="30" cy="40" r="25" fill="#10b981" />
          <circle cx="15" cy="50" r="20" fill="#059669" />
          <circle cx="45" cy="50" r="20" fill="#059669" />
        </svg>
      </div>

      {/* Trees - Right side (Fixed to ground) */}
      <div className="absolute bottom-20 right-16 z-20">
        <svg width="100" height="180" viewBox="0 0 50 90">
          {/* Tree trunk */}
          <rect x="20" y="60" width="10" height="30" fill="#8b4513" />
          {/* Tree foliage */}
          <circle cx="25" cy="35" r="22" fill="#10b981" />
          <circle cx="12" cy="45" r="18" fill="#059669" />
          <circle cx="38" cy="45" r="18" fill="#059669" />
        </svg>
      </div>

      {/* Farmer - Left side (Fixed to ground) */}
      <div className="absolute bottom-24 left-32 z-20">
        <svg width="80" height="120" viewBox="0 0 40 60">
          {/* Head */}
          <circle cx="20" cy="12" r="6" fill="#f4a460" />
          {/* Body */}
          <rect x="17" y="19" width="6" height="15" fill="#4169e1" />
          {/* Arms */}
          <line x1="12" y1="22" x2="5" y2="28" stroke="#f4a460" strokeWidth="2" />
          <line x1="28" y1="22" x2="35" y2="28" stroke="#f4a460" strokeWidth="2" />
          {/* Legs */}
          <line x1="18" y1="34" x2="16" y2="45" stroke="#8b4513" strokeWidth="2" />
          <line x1="22" y1="34" x2="24" y2="45" stroke="#8b4513" strokeWidth="2" />
          {/* Hat */}
          <circle cx="20" cy="9" r="4" fill="#d2691e" opacity="0.6" />
        </svg>
      </div>

      {/* Farmer - Right side (Fixed to ground) */}
      <div className="absolute bottom-20 right-40 z-20">
        <svg width="80" height="120" viewBox="0 0 40 60">
          {/* Head */}
          <circle cx="20" cy="12" r="6" fill="#f4a460" />
          {/* Body */}
          <rect x="17" y="19" width="6" height="15" fill="#228b22" />
          {/* Arms */}
          <line x1="12" y1="22" x2="5" y2="28" stroke="#f4a460" strokeWidth="2" />
          <line x1="28" y1="22" x2="35" y2="28" stroke="#f4a460" strokeWidth="2" />
          {/* Legs */}
          <line x1="18" y1="34" x2="16" y2="45" stroke="#8b4513" strokeWidth="2" />
          <line x1="22" y1="34" x2="24" y2="45" stroke="#8b4513" strokeWidth="2" />
          {/* Hat */}
          <circle cx="20" cy="9" r="4" fill="#d2691e" opacity="0.6" />
        </svg>
      </div>

      {/* Content - Center */}
      <div className="relative z-30 flex flex-col items-center justify-center text-center px-4">
        {/* Logo */}
        <motion.div
          className="mb-8 relative"
          animate={floatingVariants}
        >
          {/* Outer glow circle - Orange sunset reflection */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 blur-2xl opacity-60 animate-pulse" style={{ width: '160px', height: '160px', marginLeft: 'auto', marginRight: 'auto', left: '50%', transform: 'translateX(-50%)' }} />
          
          {/* Circle container with border */}
          <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-orange-300 via-orange-200 to-yellow-200 flex items-center justify-center shadow-2xl border-8 border-orange-400/50">
            <img
              src={veagLogo}
              alt="VeAg Logo"
              className="w-32 h-32 object-contain rounded-full"
            />
          </div>

          {/* Bottom reflection effect */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 w-40 h-20 rounded-full bg-gradient-to-b from-orange-400/40 to-orange-200/10 blur-xl" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-7xl sm:text-8xl lg:text-9xl font-bold text-white mb-8 drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          VeAg
        </motion.h1>

        {/* Get Started Button */}
        <motion.button
          onClick={() => navigate('/login')}
          className="px-10 sm:px-16 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-full text-xl shadow-2xl flex items-center gap-3 group hover:shadow-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </motion.button>
      </div>
    </div>
  );
};

export default Landing;
