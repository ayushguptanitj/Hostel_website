import React, { useState, useEffect } from 'react';
import './DirectorMessage.css';
import { motion } from 'framer-motion';
import DirectorImage from '../../assets/images/director.jpg'; 
import { getHomeData } from '../../utils/homeDataManager';

const DirectorMessage = () => {
  const [directorData, setDirectorData] = useState(() => getHomeData().director);

  useEffect(() => {
    const handleUpdate = () => setDirectorData(getHomeData().director);
    window.addEventListener('homeDataUpdated', handleUpdate);
    return () => window.removeEventListener('homeDataUpdated', handleUpdate);
  }, []);

  const paragraphs = Array.isArray(directorData?.messageParagraphs)
    ? directorData.messageParagraphs
    : (directorData?.message || '').split('\n\n').filter(Boolean);

  return (
    <motion.section 
      className="director-message-section"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="section-header">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Message from the Director
        </motion.h2>

        <motion.div 
          className="section-divider"
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        />
      </div>
      
      <motion.div 
        className="director-message-container"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="director-message-image">
          <motion.img 
            src={directorData?.image || DirectorImage} 
            alt="NITJ Director"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          />
          <div className="director-title">
            <h3>{directorData?.name || 'Prof. Binod Kumar Kanaujia'}</h3>
            <span>{directorData?.title || 'Director, NIT Jalandhar'}</span>
          </div>
        </div>
        
        <div className="director-message-text">
          <div className="quote-mark left-quote">❝</div>

          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}

          <div className="quote-mark right-quote">❞</div>
          
          <div className="signature">
            <span>With best wishes,</span>
            <strong>{directorData?.name || 'Prof. Binod Kumar Kanaujia'}</strong>
          </div>
          
          <motion.a 
            href="https://www.nitj.ac.in/admin/director.html" 
            className="read-more-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Read Full Message
          </motion.a>
        </div>
      </motion.div>
    </motion.section>
  );
}

export default DirectorMessage;
