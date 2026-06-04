import React from 'react';
import { motion } from 'framer-motion';
import './WardenMessage.css';

const WardenMessage = ({
  wardenMessage,
  wardenName,
  wardenEmail,
  wardenImage
}) => {
  return (
    <motion.div 
      className="warden-card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <motion.div 
        className="warden-image-section"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7, type: 'spring' }}
      >
        <div className="warden-image-wrapper">
          <img src={wardenImage} alt={wardenName} className="warden-image" />
        </div>
        <div className="warden-meta">
          <span className="warden-name">{wardenName}</span>
          <span className="warden-designation">Hostel Warden</span>
          <a href={`mailto:${wardenEmail}`} className="warden-email">{wardenEmail}</a>
        </div>
      </motion.div>
      <motion.div 
        className="warden-message-section"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <div className="warden-quote-icon">❝</div>
        <div className="warden-message-content">
          <h2 className="warden-message-title">Message from the Warden</h2>
          <p className="warden-message-text">{wardenMessage}</p>
          <div className="warden-signature">
            <span>Best Regards,</span>
            <span className="warden-signature-name">{wardenName}</span>
          </div>
        </div>
        <div className="warden-quote-icon right">❞</div>
      </motion.div>
    </motion.div>
  );
};

export default WardenMessage;
