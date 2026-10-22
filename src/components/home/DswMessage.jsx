import React, { useState, useEffect } from 'react';
import './LeaderMessage.css';
import DSWimage from '../../assets/images/dsw.jpg';
import { motion } from 'framer-motion';
import { getHomeData } from '../../utils/homeDataManager';

const DSW = () => {
  const [dswData, setDswData] = useState(() => getHomeData().dsw);

  useEffect(() => {
    const handleUpdate = () => setDswData(getHomeData().dsw);
    window.addEventListener('homeDataUpdated', handleUpdate);
    return () => window.removeEventListener('homeDataUpdated', handleUpdate);
  }, []);

  const paragraphs = Array.isArray(dswData?.messageParagraphs)
    ? dswData.messageParagraphs
    : (dswData?.message || '').split('\n\n').filter(Boolean);

  return (
    <motion.div 
      className="warden-message-section"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="section-header">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Message from the Dean Student Welfare
        </motion.h2>
        <motion.div 
          className="section-divider"
          initial={{ width: 0 }}
          whileInView={{ width: '80px' }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        ></motion.div>
      </div>
      
      <motion.div 
        className="director-container"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <motion.div 
          className="director-image"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img src={dswData?.image || DSWimage} alt="Dean Student Welfare" />
          <div className="director-title">
            <h3>{dswData?.name || 'Prof. Shailendra Bajpai'}</h3>
            <span>{dswData?.title || 'Dean Student Welfare, NITJ'}</span>
          </div>
        </motion.div>
        
        <div className="director-text">
          <div className="quote-mark left-quote">❝</div>

          {paragraphs.map((p, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + idx * 0.1, duration: 0.5 }}
            >
              {p}
            </motion.p>
          ))}

          <div className="quote-mark right-quote">❞</div>
          
          <motion.div 
            className="signature"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <span>Sincerely,</span>
            <strong>{dswData?.name || 'Prof. Shailendra Bajpai'}</strong>
          </motion.div>
          
          <motion.a 
            href="https://departments.nitj.ac.in/dept/ch/Faculty/6430445138bff038a7804c3a" 
            className="read-more-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Read Full Message
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export { DSW };