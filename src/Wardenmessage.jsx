import React from 'react';
import './wardenmessage.css';
import DirectorImage from './1708596109985-Self pic.jpg';
import { motion } from 'framer-motion';

const Wardenmessage = () => {
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
          Message from the Chief Warden
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
          <img src={DirectorImage} alt="Chief Warden" />
          <div className="director-title">
            <h3>Prof. Shailendra Bajpai</h3>
            <span>Chief Warden, NITJ Hostels</span>
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
            Welcome to our hostel community! We are committed to providing a safe, comfortable, and nurturing environment that fosters personal growth and academic excellence. Our team is dedicated to supporting you throughout your stay, ensuring you feel at home and have access to the resources you need to succeed.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            We encourage a spirit of respect, cooperation, and inclusivity, where students from diverse backgrounds can learn from each other and thrive together. We look forward to making your hostel experience a memorable and enriching part of your academic journey.
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
            <strong>Prof. Shailendra Bajpai</strong>
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

export default Wardenmessage;