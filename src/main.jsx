import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import HostelContent from './components/HostelContent'; // Import hostel data
import Hostel from './Hostel'; // Import the Hostel component
import Facilities from './components/Facilities'; // Import the Facilities component
import Homepage from './Homepage'; // Import the Homepage component
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Homepage route */}
        <Route path="/" element={<Homepage />} />

        {/* Dynamic route for individual hostels */}
        <Route path="/:hostel" element={<Hostel />} />

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
