import React from "react";
import "./LifeAtHostels.css";
import { motion } from "framer-motion";
import HostelLifeImage from "../../assets/images/cover.jpeg";

const LifeAtHostels = () => {
  return (
    <motion.section
      className="life-hostels-section"
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
          Life at NITJ Hostels
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
        className="life-hostels-container"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="life-hostels-image">
          <motion.img
            src={HostelLifeImage}
            alt="Life at NITJ Hostels"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          />
          <div className="hostel-title">
            <h3>Vibrant Hostel Community</h3>
            <span>Culture • Sports • Friendship</span>
          </div>
        </div>

        <div className="life-hostels-text">
          <div className="quote-mark left-quote">❝</div>

          <p>
            Life at NITJ hostels goes far beyond accommodation. The hostels are
            vibrant communities where students from diverse backgrounds live,
            learn, and grow together, fostering unity in diversity.
          </p>

          <p>
            From late-night study discussions and early morning routines to
            sports, cultural activities, and celebrations, hostel life plays a
            crucial role in shaping leadership, discipline, and lifelong bonds.
          </p>

          <p>
            With well-maintained facilities, green spaces, and an atmosphere of
            mutual respect, the hostels provide a safe, comfortable, and
            enriching environment for holistic student development.
          </p>

          <div className="quote-mark right-quote">❞</div>

          <motion.a
            href="#"
            className="read-more-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Hostel Life
          </motion.a>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default LifeAtHostels;
