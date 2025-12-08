import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RegisterCase from './pages/RegisterCase';
import ManageCases from './pages/ManageCases';
import EditProfile from './pages/EditProfile';
import ManageSubscription from './pages/ManageSubscription';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register-case"
            element={
              <ProtectedRoute>
                <RegisterCase />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-cases"
            element={
              <ProtectedRoute>
                <ManageCases />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-subscription"
            element={
              <ProtectedRoute>
                <ManageSubscription />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
