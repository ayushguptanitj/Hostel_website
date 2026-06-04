import React from 'react';
import './DirectorMessage.css';
import { motion } from 'framer-motion';
import DirectorImage from './Director_of_NITJ.jpg'; 

const DirectorMessage = () => {
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
            src={DirectorImage} 
            alt="NITJ Director"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          />
          <div className="director-title">
            <h3>Prof. Binod Kumar Kanaujia</h3>
            <span>Director, NIT Jalandhar</span>
          </div>
        </div>
        
        <div className="director-message-text">
          <div className="quote-mark left-quote">❝</div>

          <p>
            It gives me immense pleasure to welcome you to the hostels of the National Institute of Technology, Jalandhar. Our hostels are not merely places of residence but vibrant communities that foster holistic development.
          </p>
          <p>
            At NITJ, we believe in creating an environment where academic excellence thrives alongside personal growth. Our hostels are designed to provide comfort, safety, and a sense of belonging to all students, making their stay productive and memorable.
          </p>
          <p>
            I encourage all students to actively participate in hostel activities, maintain discipline, and uphold the values of respect and cooperation. Your time in the hostel will contribute significantly to your overall development and prepare you for future challenges.
          </p>

          <div className="quote-mark right-quote">❞</div>
          
          <div className="signature">
            <span>With best wishes,</span>
            <strong>Prof. Binod Kumar Kanaujia</strong>
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
