import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/index.css';
import HostelPage from './pages/HostelPage/HostelPage';
import Facilities from './components/hostel/Facilities';
import HomePage from './pages/HomePage/HomePage';
import AdminPortal from './admin/AdminPortal';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* Homepage route */}
        <Route path="/" element={<HomePage />} />

        {/* Admin Portal routes */}
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/admin/:hostel" element={<AdminPortal />} />

        {/* Dynamic route for individual hostels */}
        <Route path="/:hostel" element={<HostelPage />} />

        {/* Route for the facilities page */}
        <Route path="/facilities/:hostelId" element={<Facilities />} />
      </Routes>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
