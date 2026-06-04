import React from "react";
import "./LifeAtHostels.css";
import { motion } from "framer-motion";
import HostelLifeImage from "../assets/images/cover.jpeg";


const LifeAtHostels = () => {
  return (
    <motion.section
      className="life-hostels-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Life at NITJ Hos.kxakstels
      </motion.h2>

      <div className="life-hostels-container">
        <div className="life-hostels-image">
          <img src={HostelLifeImage} alt="Life at NITJ Hostels" />
        </div>

        <div className="life-hostels-text">
          <p>
            Our hostels are vibrant communities that foster unity, discipline,
            and lifelong friendship bchcehlce s among students from diverse backgrounds.
          </p>
          <p>
            From late-night discussions to sports and cultural activities, hostel
            life at NITJ ensures holistic development beyond academics.
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default LifeAtHostels;
