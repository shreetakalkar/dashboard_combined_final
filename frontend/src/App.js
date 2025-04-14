import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginPage from './components/SignIn/index';
import RegisterPage from './components/Register/index';
import ShopifySync from './components/ShopifySync/ShopifySync';
import Inventory from './components/Inventory';
import OTPVerification from './components/OTPVerification/index';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Orders from './components/Order/Orders';
import Settings from './components/Settings';
import Request from './components/Request';
import Plans from './components/Plans';
import Webform from './components/Webform';
import ShopifyProducts from './components/ShopifySync/ShopifyProducts';
import ScrollToTop from './components/ScrollToTop';
import { SidebarProvider } from './components/Sidebar/SidebarContext';

let originalFetch = window.fetch; // Fix ESLint error by declaring globally

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (err) {
      return true;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token) {
      const expired = isTokenExpired(token);
      if (expired) {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        navigate('/login');
      } else {
        setIsAuthenticated(true);

        // Override fetch to handle 401
        window.fetch = async (...args) => {
          const response = await originalFetch(...args);
          if (response.status === 401) {
            localStorage.removeItem('authToken');
            setIsAuthenticated(false);
            navigate('/login');
          }
          return response;
        };
      }
    } else {
      setIsAuthenticated(false);
    }

    setIsLoading(false);

    return () => {
      // Cleanup fetch override
      window.fetch = originalFetch;
    };
  }, [navigate]);

  const MainLayout = ({ children }) => (
    <>
      <Header />
      <Sidebar />
      {children}
    </>
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <SidebarProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/shopify-sync" replace />} />
        <Route path="/signup" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/shopify-sync" replace />} />
        <Route path="/otp-verification" element={!isAuthenticated ? <OTPVerification /> : <Navigate to="/shopify-sync" replace />} />

        <Route path="/shopify-sync" element={isAuthenticated ? <MainLayout><ShopifySync /></MainLayout> : <Navigate to="/login" replace />} />
        <Route path="/inventory" element={isAuthenticated ? <MainLayout><Inventory /></MainLayout> : <Navigate to="/login" replace />} />
        <Route path="/order/*" element={isAuthenticated ? <MainLayout><Orders /></MainLayout> : <Navigate to="/login" replace />} />
        <Route path="/settings" element={isAuthenticated ? <MainLayout><Settings /></MainLayout> : <Navigate to="/login" replace />} />
        <Route path="/request" element={isAuthenticated ? <MainLayout><Request /></MainLayout> : <Navigate to="/login" replace />} />
        <Route path="/plans" element={isAuthenticated ? <MainLayout><Plans /></MainLayout> : <Navigate to="/login" replace />} />
        <Route path="/webform" element={isAuthenticated ? <MainLayout><Webform /></MainLayout> : <Navigate to="/login" replace />} />
        <Route path="/shopify-products" element={isAuthenticated ? <MainLayout><ShopifyProducts /></MainLayout> : <Navigate to="/login" replace />} />

        <Route path="/" element={<Navigate to={isAuthenticated ? "/shopify-sync" : "/login"} replace />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/shopify-sync" : "/login"} replace />} />
      </Routes>
    </SidebarProvider>
  );
}

export default App;
