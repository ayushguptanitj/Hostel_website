import React from 'react';
import './wardenmessage.css';
import DSWimage from './dswimage.jpg';
import { motion } from 'framer-motion';

const DSW = () => {
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
          <img src={DSWimage} alt="Chief Warden" />
          <div className="director-title">
            <h3>Prof. Anish Sachdeva</h3>
            <span>Dean Student Welfare, NITJ</span>
          </div>
        </motion.div>
        
        <div className="director-text">
          <div className="quote-mark left-quote">❝</div>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            It is my pleasure to welcome you to the hostel community of Dr. B R Ambedkar National Institute of Technology Jalandhar.

            Hostel life plays a vital role in shaping a student’s academic and personal growth. Our hostels provide a safe, disciplined, and inclusive environment that supports learning, collaboration, and overall development. We are committed to ensuring essential facilities, security, and student welfare at all times.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            I encourage every student to actively participate in hostel activities and uphold the values of mutual respect and responsibility.

            I wish you a comfortable and enriching stay at NIT Jalandhar.
          </motion.p>
          <div className="quote-mark right-quote">❞</div>
          
          <motion.div 
            className="signature"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <span>Sincerely,</span>
            <strong>Prof. Anish Sachdeva</strong>
          </motion.div>
          
          <motion.a 
            href="https://departments.nitj.ac.in/dept/ipe/Faculty/6430445738bff038a780609d" 
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