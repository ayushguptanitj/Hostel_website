// src/components/MBHAbout.js

import React from 'react';
import './MBHAbout.css';

const MBHAbout = ({ name, description, image }) => {
  return (
    <div className="mbh-about-container">
      <div className="text-content">
        <h1 className='about'><span>ABOUT</span><hr /></h1>
        <h1>{name}</h1>
        <p>{description}</p>
      </div>
      <div className="image-content">
        <img src={image} alt={name} />
      </div>
    </div>
  );
};

export default MBHAbout;
