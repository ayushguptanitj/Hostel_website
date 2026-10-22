import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import './Facilities.css';

const getFacilityIcon = (type) => {
  switch (type) {
    case 'Library': return '📚';
    case 'Wi-Fi': return '📶';
    case 'Park': return '🌳';
    case 'Washing Machine': return '🧺';
    case 'Common Room': return '🛋️';
    case 'Security': return '🛡️';
    default: return '🏢';
  }
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.13 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const Facilities = ({ facilities = [] }) => {
  if (facilities.length === 0) {
    return <p>No facilities available for this hostel.</p>;
  }

  return (
    <motion.div
      className="allfacilities"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {facilities.map((facility, idx) => {
        const { title, description, quote, image, type } = facility;

        return (
          <motion.div
            className="facility-container enhanced glass"
            key={`${title}-${idx}`}
            variants={cardVariants}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 12px 40px rgba(26,35,126,0.13)'
            }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="facility-top">
              <span
                className="facility-icon"
                aria-label={type}
                title={type}
              >
                {getFacilityIcon(type)}
              </span>

              <img
                src={image}
                alt={`Facility: ${title}`}
                loading="lazy"
              />
            </div>

            <div className="facility-details">
              <h2 className="facilitytitle">{title}</h2>
              <p>{description}</p>
              {quote && (
                <span className="facility-quote">
                  {quote}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

Facilities.propTypes = {
  facilities: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      quote: PropTypes.string,
      image: PropTypes.string,
      type: PropTypes.string,
    }).isRequired
  ),
};

export default Facilities;
