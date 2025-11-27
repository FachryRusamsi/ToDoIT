import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TaskFormPage from './pages/TaskFormPage';
import Navbar from './components/Navbar';

const isAuthenticated = () => !!localStorage.getItem('token');

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const authed = isAuthenticated();

  return (
    <div className="min-h-screen flex flex-col">
      {authed && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/tasks/new"
            element={
              <PrivateRoute>
                <TaskFormPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/tasks/:id/edit"
            element={
              <PrivateRoute>
                <TaskFormPage />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
