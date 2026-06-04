// src/components/Gallery.js

import React from 'react';
import './Gallery.css';

const Gallery = ({ gallery }) => {
  return (
    <div>
      <div className="section-title" data-aos="zoom-out">
       
      </div>
      <div className='cont'>
        <div className='portfolio-container'>
          {gallery.map((item, index) => (
            <div key={index} className="portfolio-item">
              <div className="portfolio-img">
                <img
                  src={item.imgSrc}
                  className="img-fluid"
                  alt={item.alt}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
