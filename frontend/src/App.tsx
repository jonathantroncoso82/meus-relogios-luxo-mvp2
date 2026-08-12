import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WatchesPage from './pages/WatchesPage';
import WatchDetailPage from './pages/WatchDetailPage';
import BrandsPage from './pages/BrandsPage';
import CollectionsPage from './pages/CollectionsPage';
import ServiceRecordsPage from './pages/ServiceRecordsPage';
import ValuationsPage from './pages/ValuationsPage';

export default function App() {
  const initFromStorage = useAuthStore((s) => s.initFromStorage);

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/watches" element={<WatchesPage />} />
            <Route path="/watches/:id" element={<WatchDetailPage />} />
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/service-records" element={<ServiceRecordsPage />} />
            <Route path="/valuations" element={<ValuationsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
