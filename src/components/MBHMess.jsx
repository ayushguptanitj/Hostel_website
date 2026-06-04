// src/components/MBHMess.js

import React from 'react';
import './MBHMess.css';

const MBHMess = ({ messDetails, messImage }) => {
  return (
    <div className="mess-container">
      <div className="text-content">
        
        <p>{messDetails}</p> {/* Display dynamic mess details */}
      </div>
      <div className="image-content">
        <img src={messImage} alt="Hostel Mess" /> {/* Display dynamic mess image */}
      </div>
    </div>
  );
};

export default MBHMess;
