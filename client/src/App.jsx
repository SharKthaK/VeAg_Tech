import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RegisterCase from './pages/RegisterCase';
import ManageCases from './pages/ManageCases';
import CaseDetail from './pages/CaseDetail';
import EditProfile from './pages/EditProfile';
import ManageSubscription from './pages/ManageSubscription';
import NotFound from './pages/NotFound';

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
            path="/case/:caseId"
            element={
              <ProtectedRoute>
                <CaseDetail />
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
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
