import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHostelData } from '../../utils/hostelDataManager';
import Carousel from '../../components/hostel/Carousel';
import { Contact } from '../../components/hostel/Contact';
import MBHAbout from '../../components/hostel/MBHAbout';
import WardenMessage from '../../components/hostel/WardenMessage';
import MBHMess from '../../components/hostel/MBHMess';
import Facilities from '../../components/hostel/Facilities';
import Gallery from '../../components/hostel/Gallery';
import StudentCorner from '../../components/hostel/StudentCorner';
import HostelCommittee from '../../components/hostel/HostelCommittee';
import announcements from '../../data/announcements';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './HostelPage.css';

const sectionFade = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
};

const dividerAnim = {
  hidden: { width: 0 },
  visible: { width: '80px', transition: { duration: 0.5 } }
};

const Hostel = () => {
  const { hostel } = useParams();
  const [currentHostel, setCurrentHostel] = useState(() => getHostelData(hostel));

  useEffect(() => {
    setCurrentHostel(getHostelData(hostel));
  }, [hostel]);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (!e.detail?.hostelKey || e.detail.hostelKey === hostel) {
        setCurrentHostel(getHostelData(hostel));
      }
    };
    window.addEventListener('hostelDataUpdated', handleUpdate);
    return () => window.removeEventListener('hostelDataUpdated', handleUpdate);
  }, [hostel]);

  const [activeSection, setActiveSection] = useState('about');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  // For animating sections on scroll
  const [aboutRef, aboutInView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const [wardenRef, wardenInView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const [messRef, messInView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const [facilitiesRef, facilitiesInView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const [galleryRef, galleryInView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const [contactRef, contactInView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const [committeeRef, committeeInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [cornerRef, cornerInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll-spy
  useEffect(() => {
    const ids = ['about', 'warden', 'mess', 'facilities', 'gallery', 'contact', 'committee', 'student-corner'];
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.25, rootMargin: '-64px 0px 0px 0px' }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!currentHostel) {
    return (
      <div className="hostel-not-found">
        <h1>Hostel not found</h1>
        <Link to="/" className="back-home">Back to Home</Link>
      </div>
    );
  }

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'warden', label: "Warden's Message" },
    { id: 'mess', label: 'Mess' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
    { id: 'committee', label: 'Committee' },
    { id: 'student-corner', label: 'Student Corner' },
  ];

  return (
    <div className="hostel-page">

      {/* ── Sticky Navbar ── */}
      <nav className="hn-nav" ref={navRef}>
        <div className="hn-nav-inner">

          {/* Left: Back + Hostel Name */}
          <div className="hn-left">
            <Link to="/" className="hn-back">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              <span className="hn-back-label">Home</span>
            </Link>
            <div className="hn-divider" />
            <span className="hn-hostel-name">{currentHostel.name}</span>
          </div>

          {/* Desktop: Section Links */}
          <ul className="hn-links">
            {navItems.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={scrollTo(id)}
                  className={`hn-link ${activeSection === id ? 'hn-link--active' : ''}`}
                >
                  {activeSection === id && (
                    <motion.span
                      layoutId="hn-pill"
                      className="hn-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="hn-link-label">{label}</span>
                </a>
              </li>
            ))}
            <li>
              <Link
                to={`/admin?hostel=${hostel}`}
                className="hn-link"
                style={{ color: '#1a56db', fontWeight: 600 }}
                title="Edit hostel content"
              >
                <span className="hn-link-label">⚙️ Admin</span>
              </Link>
            </li>
          </ul>

          {/* Mobile: Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="hn-hamburger"
            aria-label="Toggle menu"
          >
            <span className={`hn-bar ${isMobileMenuOpen ? 'hn-bar--1-open' : ''}`} />
            <span className={`hn-bar ${isMobileMenuOpen ? 'hn-bar--2-open' : ''}`} />
            <span className={`hn-bar ${isMobileMenuOpen ? 'hn-bar--3-open' : ''}`} />
          </button>
        </div>

        {/* Mobile: Slide-down menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="hn-mobile-menu"
            >
              <ul className="hn-mobile-list">
                {navItems.map(({ id, label }, i) => (
                  <motion.li
                    key={id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hn-mobile-item"
                  >
                    <a
                      href={`#${id}`}
                      onClick={scrollTo(id)}
                      className={`hn-mobile-link ${activeSection === id ? 'hn-mobile-link--active' : ''}`}
                    >
                      <span className="hn-mobile-dot" />
                      {label}
                    </a>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  className="hn-mobile-item"
                >
                  <Link
                    to={`/admin?hostel=${hostel}`}
                    className="hn-mobile-link"
                    style={{ color: '#1a56db', fontWeight: 600 }}
                  >
                    <span className="hn-mobile-dot" />
                    ⚙️ Admin Login
                  </Link>
                </motion.li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Carousel */}
      <section className="hostel-hero" style={{ position: 'relative' }}>
        <Carousel
          images={currentHostel.carouselImages}
        />
      </section>

      {/* Main Content */}
      <main className="hostel-content">
        {/* About Section */}
        <motion.section
          id="about"
          className="hostel-section"
          ref={aboutRef}
          initial="hidden"
          animate={aboutInView ? 'visible' : 'hidden'}
          variants={sectionFade}
        >
          <motion.div className="section-header" initial="hidden" animate={aboutInView ? 'visible' : 'hidden'}>
            <motion.h2>About</motion.h2>
            <motion.div className="section-divider" variants={dividerAnim}></motion.div>
          </motion.div>
          <MBHAbout
            name={currentHostel.name}
            description={currentHostel.description}
            image={currentHostel.image}
          />
        </motion.section>
        {/* Warden's Message */}
        <motion.section
          id="warden"
          className="hostel-section"
          ref={wardenRef}
          initial="hidden"
          animate={wardenInView ? 'visible' : 'hidden'}
          variants={sectionFade}
        >
          <motion.div className="section-header" initial="hidden" animate={wardenInView ? 'visible' : 'hidden'}>
            <motion.h2>Warden&apos;s Message</motion.h2>
            <motion.div className="section-divider" variants={dividerAnim}></motion.div>
          </motion.div>
          <WardenMessage 
            wardenMessage={currentHostel.wardenMessage} 
            wardenName={currentHostel.wardenName} 
            wardenImage={currentHostel.wardenImage} 
            wardenEmail={currentHostel.wardenEmail}
            wardenPhone={currentHostel.wardenPhone}
            wardens={currentHostel.wardens}
          />
        </motion.section>
        {/* Mess Section */}
        <motion.section
          id="mess"
          className="hostel-section"
          ref={messRef}
          initial="hidden"
          animate={messInView ? 'visible' : 'hidden'}
          variants={sectionFade}
        >
          <motion.div className="section-header" initial="hidden" animate={messInView ? 'visible' : 'hidden'}>
            <motion.h2>Mess</motion.h2>
            <motion.div className="section-divider" variants={dividerAnim}></motion.div>
          </motion.div>
          <MBHMess
            messDetails={currentHostel.mess}
            messImage={currentHostel.messImage}
          />
        </motion.section>
        {/* Facilities Section */}
        <motion.section
          id="facilities"
          className="hostel-section"
          ref={facilitiesRef}
          initial="hidden"
          animate={facilitiesInView ? 'visible' : 'hidden'}
          variants={sectionFade}
        >
          <motion.div className="section-header" initial="hidden" animate={facilitiesInView ? 'visible' : 'hidden'}>
            <motion.h2>Facilities</motion.h2>
            <motion.div className="section-divider" variants={dividerAnim}></motion.div>
          </motion.div>
          <Facilities facilities={currentHostel.facilities} />
        </motion.section>
        {/* Gallery Section */}
        <motion.section
          id="gallery"
          className="hostel-section"
          ref={galleryRef}
          initial="hidden"
          animate={galleryInView ? 'visible' : 'hidden'}
          variants={sectionFade}
        >
          <motion.div className="section-header" initial="hidden" animate={galleryInView ? 'visible' : 'hidden'}>
            <motion.h2>Gallery</motion.h2>
            <motion.div className="section-divider" variants={dividerAnim}></motion.div>
          </motion.div>
          <Gallery gallery={currentHostel.gallery} />
        </motion.section>
        {/* Contact Section */}
        <motion.section
          id="contact"
          className="hostel-section"
          ref={contactRef}
          initial="hidden"
          animate={contactInView ? 'visible' : 'hidden'}
          variants={sectionFade}
        >
          <motion.div className="section-header" initial="hidden" animate={contactInView ? 'visible' : 'hidden'}>
            <motion.h2>Contact</motion.h2>
            <motion.div className="section-divider" variants={dividerAnim}></motion.div>
          </motion.div>
          <Contact contact={currentHostel.contact} />
        </motion.section>

        {/* Hostel Committee Section */}
        <motion.section
          id="committee"
          className="hostel-section"
          ref={committeeRef}
          initial="hidden"
          animate={committeeInView ? 'visible' : 'hidden'}
          variants={sectionFade}
        >
          <motion.div className="section-header" initial="hidden" animate={committeeInView ? 'visible' : 'hidden'}>
            <motion.h2>Hostel Committee</motion.h2>
            <motion.div className="section-divider" variants={dividerAnim}></motion.div>
          </motion.div>
          <HostelCommittee committee={currentHostel.committee} />
        </motion.section>

        {/* Student Corner Section */}
        <motion.section
          id="student-corner"
          className="hostel-section"
          ref={cornerRef}
          initial="hidden"
          animate={cornerInView ? 'visible' : 'hidden'}
          variants={sectionFade}
        >
          <motion.div className="section-header" initial="hidden" animate={cornerInView ? 'visible' : 'hidden'}>
            <motion.h2>Student Corner</motion.h2>
            <motion.div className="section-divider" variants={dividerAnim}></motion.div>
            <p className="section-subtitle">Announcements &amp; updates from the hostel administration</p>
          </motion.div>
          <StudentCorner
            hostelKey={hostel}
            announcements={announcements}
            customAnnouncements={currentHostel.announcements}
          />
        </motion.section>
      </main>
    </div>
  );
};

export default Hostel;
