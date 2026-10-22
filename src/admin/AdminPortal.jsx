import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import MainAdminDashboard from './MainAdminDashboard';
import { getCurrentAdminHostel, getHostelConfig } from '../utils/hostelDataManager';

const AdminPortal = () => {
  const { hostel: routeHostel } = useParams();
  const [currentAdminHostel, setCurrentAdminHostel] = useState(() => getCurrentAdminHostel());

  useEffect(() => {
    // If route specifies a hostel and user is already logged in as that hostel, keep it.
    // If route specifies a hostel but user is logged in as a different hostel, they remain in their session.
    const loggedHostel = getCurrentAdminHostel();
    setCurrentAdminHostel(loggedHostel);

    const handleSessionChange = (e) => {
      setCurrentAdminHostel(e.detail?.hostelKey || null);
    };

    window.addEventListener('adminSessionChanged', handleSessionChange);
    return () => window.removeEventListener('adminSessionChanged', handleSessionChange);
  }, [routeHostel]);

  const handleLoginSuccess = (hostelKey) => {
    setCurrentAdminHostel(hostelKey);
  };

  const handleLogout = () => {
    setCurrentAdminHostel(null);
  };

  if (!currentAdminHostel) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // If logged in as Main Website Admin
  if (currentAdminHostel === 'main') {
    return (
      <MainAdminDashboard
        onLogout={handleLogout}
        onSwitchToHostel={(hKey) => setCurrentAdminHostel(hKey)}
      />
    );
  }

  return (
    <AdminDashboard
      hostelKey={currentAdminHostel}
      onLogout={handleLogout}
    />
  );
};

export default AdminPortal;
