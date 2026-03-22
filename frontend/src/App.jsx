import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Nav from './components/Nav';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import TracksPage from './pages/TracksPage';
import ServicesPage from './pages/ServicesPage';
import BookPage from './pages/BookPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/tracks" element={<TracksPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/book" element={<BookPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{
          style: { fontFamily: "'DM Mono', monospace", borderRadius: '4px', background: '#1A1A28', color: '#F0F0FF', border: '1px solid rgba(0,245,255,0.2)', fontSize: '0.85rem' },
          success: { iconTheme: { primary: '#00F5FF', secondary: '#050508' } },
          error: { iconTheme: { primary: '#FF0080', secondary: '#050508' } },
        }} />
      </BrowserRouter>
    </AuthProvider>
  );
}
