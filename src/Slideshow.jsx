import React, { useState, useEffect } from 'react';
import './Slideshow.css';

const images = [
    '/images/nitj.png',
    '/images/hostel-7.jpeg',
    '/images/mgh.png',
    '/images/mbh.jpeg',
    '/images/mega-hostel-boys.jpg'
];

const Slideshows = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Change image every 3 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="slideshow-container">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`slide ${index === currentIndex ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${image})` }}
                />
            ))}
        </div>
    );
}

export default Slideshows;

