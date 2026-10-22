import React from 'react';
import { motion } from 'framer-motion';
import './WardenMessage.css';

const WardenMessage = ({
  wardenMessage,
  wardenName,
  wardenEmail,
  wardenPhone,
  wardenImage,
  wardens,
}) => {
  const isMultiWarden = Array.isArray(wardens) && wardens.length > 0;

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
        style={isMultiWarden ? { display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' } : {}}
      >
        {isMultiWarden ? (
          wardens.map((w, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minWidth: '180px' }}>
              <div className="warden-image-wrapper">
                <img src={w.image || wardenImage} alt={w.name} className="warden-image" />
              </div>
              <div className="warden-meta" style={{ marginTop: '0.5rem' }}>
                <span className="warden-name" style={{ fontSize: '1.05rem' }}>{w.name}</span>
                <span className="warden-designation">{w.designation || 'Hostel Warden'}</span>
                <a href={`mailto:${w.email}`} className="warden-email">{w.email}</a>
                {w.phone && (
                  <a href={`tel:${w.phone}`} className="warden-phone" style={{ fontSize: '0.875rem', color: '#475569', textDecoration: 'none', marginTop: '0.2rem' }}>
                    📞 {w.phone}
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="warden-image-wrapper">
              <img src={wardenImage} alt={wardenName} className="warden-image" />
            </div>
            <div className="warden-meta">
              <span className="warden-name">{wardenName}</span>
              <span className="warden-designation">Hostel Warden</span>
              <a href={`mailto:${wardenEmail}`} className="warden-email">{wardenEmail}</a>
              {wardenPhone && (
                <a href={`tel:${wardenPhone}`} className="warden-phone" style={{ fontSize: '0.875rem', color: '#475569', textDecoration: 'none', marginTop: '0.2rem' }}>
                  📞 {wardenPhone}
                </a>
              )}
            </div>
          </>
        )}
      </motion.div>
      <motion.div 
        className="warden-message-section"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <div className="warden-quote-icon">❝</div>
        <div className="warden-message-content">
          <h2 className="warden-message-title">Message from the {isMultiWarden ? 'Wardens' : 'Warden'}</h2>
          <p className="warden-message-text">{wardenMessage}</p>
          <div className="warden-signature">
            <span>Best Regards,</span>
            {isMultiWarden ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                {wardens.map((w, idx) => (
                  <span key={idx} className="warden-signature-name">
                    {w.name} <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: '#64748b' }}>({w.designation || 'Hostel Warden'})</span>
                  </span>
                ))}
              </div>
            ) : (
              <span className="warden-signature-name">{wardenName}</span>
            )}
          </div>
        </div>
        <div className="warden-quote-icon right">❞</div>
      </motion.div>
    </motion.div>
  );
};

export default WardenMessage;
