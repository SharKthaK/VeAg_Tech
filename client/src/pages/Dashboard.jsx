import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, FileText, FolderOpen, User, CreditCard } from 'lucide-react';
import veagLogo from '../assets/veag_logo.svg';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSupportPopup, setShowSupportPopup] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
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
      icon: FileText,
      color: 'from-emerald-500/30 to-green-500/30'
    },
    {
      title: 'Manage Old Cases',
      path: '/manage-cases',
      icon: FolderOpen,
      color: 'from-blue-500/30 to-cyan-500/30'
    },
    {
      title: 'Edit your Profile',
      path: '/edit-profile',
      icon: User,
      color: 'from-purple-500/30 to-pink-500/30'
    },
    {
      title: 'Manage Subscription',
      path: '/manage-subscription',
      icon: CreditCard,
      color: 'from-orange-500/30 to-red-500/30'
    }
  ];

  // Loading State
  if (isLoading) {
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

        {/* Loading Content */}
        <motion.div
          className="relative z-30 flex flex-col items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Beautiful Loader */}
          <div className="relative w-20 h-20">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-white border-r-white"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border-4 border-transparent border-b-white border-l-white"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-4 rounded-full border-2 border-transparent border-t-white"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* Loading Text */}
          <motion.p
            className="text-white font-semibold text-lg drop-shadow-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading Dashboard...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-300 via-orange-200 to-yellow-100 overflow-hidden relative">
      {/* Sky background with clouds */}
      <motion.div
        className="fixed top-12 left-12 w-32 h-16 bg-white rounded-full opacity-70 blur-xl"
        animate={{ x: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="fixed top-24 right-20 w-40 h-20 bg-white rounded-full opacity-60 blur-xl"
        animate={{ x: [0, -40, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Mountains - Back Layer */}
      <svg
        className="fixed bottom-0 left-0 w-full h-80 opacity-50 pointer-events-none"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#a0522d"
          d="M0,160L60,144C120,128,240,96,360,112C480,128,600,192,720,186.7C840,181,960,107,1080,96C1200,85,1320,139,1380,165.3L1440,192L1440,320L0,320Z"
        />
      </svg>

      {/* Mountains - Middle Layer */}
      <svg
        className="fixed bottom-0 left-0 w-full h-64 opacity-70 pointer-events-none"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#d97706"
          d="M0,96L60,112C120,128,240,160,360,160C480,160,600,128,720,122.7C840,117,960,139,1080,144C1200,149,1320,139,1380,133.3L1440,128L1440,320L0,320Z"
        />
      </svg>

      {/* Grass at the bottom */}
      <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-b from-green-600 to-green-700 z-10 pointer-events-none" />

      {/* Header */}
      <div className="relative z-20 bg-black/30 backdrop-blur-2xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center gap-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full bg-white/20 border-2 border-white backdrop-blur-md flex items-center justify-center overflow-hidden">
                <img src={veagLogo} alt="VeAg Logo" className="w-10 h-10 object-contain rounded-full" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">VeAg</h1>
            </div>

            {/* User Info and Actions */}
            <div className="flex items-center gap-3 sm:gap-6">
              {/* Support Button */}
              <motion.button
                onClick={() => setShowSupportPopup(true)}
                className="p-2 sm:p-2.5 bg-black/30 hover:bg-black/40 backdrop-blur-md border border-white/30 hover:border-white/50 rounded-full transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Support"
              >
                <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.button>

              {/* User Profile */}
              {currentUser?.photoURL && !imageError ? (
                <div className="relative w-10 h-10">
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full border border-white/30">
                      <div className="w-5 h-5 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    className={`w-10 h-10 rounded-full border-2 border-white/50 object-cover transition-opacity duration-200 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full border-2 border-white/50 bg-white/20 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{currentUser?.name?.charAt(0).toUpperCase()}</span>
                </div>
              )}

              {/* User Name - Hidden on small screens */}
              <span className="text-white font-medium hidden sm:inline">{currentUser?.name}</span>

              {/* Logout Button */}
              <motion.button
                onClick={handleLogout}
                className="px-4 sm:px-6 py-2 bg-black/30 hover:bg-black/40 backdrop-blur-md text-white font-semibold rounded-lg border border-white/30 hover:border-white/50 transition-all duration-300 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg text-center">
            Welcome, {currentUser?.name?.split(' ')[0]}!
          </h2>
          <p className="text-white/80 text-center mt-2 drop-shadow-md">Manage your crop disease cases efficiently</p>
        </motion.div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {navigationButtons.map((button, index) => (
            <motion.button
              key={index}
              onClick={() => navigate(button.path)}
              className={`relative h-full overflow-hidden p-6 sm:p-8 bg-gradient-to-br ${button.color} backdrop-blur-md border border-white/40 hover:border-white/60 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.08, y: -8 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Subtle glow effect on hover */}
              <div className="absolute -inset-1 bg-gradient-to-br from-white/0 via-white/10 to-white/0 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-300" />

              <div className="relative z-10 flex flex-col h-full justify-start">
                {/* Icon */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/15 border border-white/30 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-white/25 transition-all duration-300">
                  <button.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-md" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white drop-shadow-md group-hover:text-white transition-all duration-300">
                  {button.title}
                </h3>

                {/* Subtle bottom border animation */}
                <div className="mt-auto h-1 bg-gradient-to-r from-white/0 via-white/30 to-white/0 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Support Popup */}
      <AnimatePresence>
        {showSupportPopup && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSupportPopup(false)}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Popup */}
            <motion.div
              className="relative bg-black/40 backdrop-blur-2xl border border-white/30 rounded-3xl p-8 max-w-md w-full shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                onClick={() => setShowSupportPopup(false)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-full transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.button>

              {/* Content */}
              <div className="text-center">
                <HelpCircle className="w-12 h-12 text-white mx-auto mb-4 drop-shadow-lg" />
                <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">Need Help?</h3>
                <p className="text-white/80 mb-8 drop-shadow-md">
                  Have a question or issue? We're here to help!
                </p>

                {/* Support Email Link */}
                <motion.a
                  href="mailto:sarthak@vacantvectors.com"
                  className="inline-flex items-center justify-center w-full px-6 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 hover:border-white/50 text-white font-semibold rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="drop-shadow-md">Contact Support</span>
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
