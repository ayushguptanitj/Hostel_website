import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Navbar.css";

// Hostel data
const boysHostels = [
  { name: "Krishna Boys Hostel", key: "BH-1" },
  { name: "Sutlej Boys Hostel", key: "BH-2" },
  { name: "Beas Boys Hostel", key: "BH-3" },
  { name: "Ravi Boys Hostel", key: "BH-4" },
  { name: "Chenab Boys Hostel", key: "BH-5" },
  { name: "Jhelum Boys Hostel", key: "BH-6" },
  { name: "Brahmaputra Boys Hostel", key: "BH-7" },
  { name: "Narmada Boys Hostel", key: "MBH-A-Block" },
  { name: "Godavari Boys Hostel", key: "MBH-B-Block" },
  { name: "Bhagirathi Boys Hostel", key: "MBH-E-Block" },
  { name: "Sabarmati Boys Hostel", key: "MBH-F-Block" },
];

const girlsHostels = [
  { name: "Sarsawati Girls Hostel", key: "girls-hostel-1" },
  { name: "Ganga Girls Hostel", key: "girls-hostel-2" },
  { name: "Alaknanda Girls Hostel", key: "mega-girls-hostel-1" },
  { name: "Yamuna Girls Hostel", key: "MGH-Phase-II" },
];

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBoysOpen, setIsBoysOpen] = useState(false);
  const [isGirlsOpen, setIsGirlsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef(null);
  const navigate = useNavigate();

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsBoysOpen(false);
    setIsGirlsOpen(false);
  };

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return;
    }
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [navigate]);

  const handleNavClick = (id) => (e) => {
    e.preventDefault();
    scrollToSection(id);
    closeAllMenus();
  };

  const handleHostelClick = (key) => (e) => {
    e.preventDefault();
    navigate(`/${key}`);
    window.scrollTo(0, 0);
    closeAllMenus();
  };

  const toggleDropdown = (type) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "boys") {
      setIsBoysOpen((prev) => !prev);
      setIsGirlsOpen(false);
    } else {
      setIsGirlsOpen((prev) => !prev);
      setIsBoysOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const ids = ["home", "life-at-hostels", "director-message"];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" }
    );
    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) closeAllMenus();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const ChevronIcon = ({ open }) => (
    <svg
      className={`nb-chevron ${open ? "nb-chevron--open" : ""}`}
      width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
    </svg>
  );

  const DropdownMenu = ({ items, onItemClick }) => (
    <motion.ul
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="nb-dropdown-menu"
    >
      {items.map((h, idx) => (
        <motion.li
          key={h.key}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.03 }}
        >
          <a
            href={`/${h.key}`}
            onClick={onItemClick(h.key)}
            className="nb-dropdown-item"
          >
            <span className="nb-dropdown-dot" />
            {h.name}
          </a>
        </motion.li>
      ))}
    </motion.ul>
  );

  return (
    <header className={`nb-header ${scrolled ? "nb-header--scrolled" : ""}`}>
      <nav ref={navRef} className="nb-nav">

        {/* ── Logo ── */}
        <motion.a
          href="#home"
          onClick={handleNavClick("home")}
          className="nb-logo"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <span className="nb-logo-primary">NIT Jalandhar</span>
          <span className="nb-logo-sub">Hostels</span>
        </motion.a>

        {/* ── Hamburger (Mobile) ── */}
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="nb-hamburger"
          aria-label="Toggle menu"
        >
          <span className={`nb-bar ${isMobileMenuOpen ? "nb-bar--1-open" : ""}`} />
          <span className={`nb-bar ${isMobileMenuOpen ? "nb-bar--2-open" : ""}`} />
          <span className={`nb-bar ${isMobileMenuOpen ? "nb-bar--3-open" : ""}`} />
        </button>

        {/* ── Desktop Links ── */}
        <ul className="nb-links">
          {[
            { label: "Home", id: "home" },
            { label: "Life at NITJ", id: "life-at-hostels" },
            { label: "Dignitaries", id: "director-message" },
          ].map(({ label, id }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={handleNavClick(id)}
                className={`nb-link ${activeSection === id ? "nb-link--active" : ""}`}
              >
                {activeSection === id && (
                  <motion.span
                    layoutId="nb-pill"
                    className="nb-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="nb-link-label">{label}</span>
              </a>
            </li>
          ))}

          {/* Boys Hostels */}
          <li className="nb-has-dropdown">
            <button
              onClick={toggleDropdown("boys")}
              className={`nb-link nb-link-btn ${isBoysOpen ? "nb-link--dropdown-open" : ""}`}
            >
              <span className="nb-link-label">Boys Hostels</span>
              <ChevronIcon open={isBoysOpen} />
            </button>
            <AnimatePresence>
              {isBoysOpen && <DropdownMenu items={boysHostels} onItemClick={handleHostelClick} />}
            </AnimatePresence>
          </li>

          {/* Girls Hostels */}
          <li className="nb-has-dropdown">
            <button
              onClick={toggleDropdown("girls")}
              className={`nb-link nb-link-btn ${isGirlsOpen ? "nb-link--dropdown-open" : ""}`}
            >
              <span className="nb-link-label">Girls Hostels</span>
              <ChevronIcon open={isGirlsOpen} />
            </button>
            <AnimatePresence>
              {isGirlsOpen && <DropdownMenu items={girlsHostels} onItemClick={handleHostelClick} />}
            </AnimatePresence>
          </li>

          {/* Admin Portal Link */}
          <li>
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                navigate('/admin');
                closeAllMenus();
              }}
              className="nb-link"
              style={{ color: '#1a56db', fontWeight: 600 }}
              title="Hostel Admin Login & Content Management"
            >
              <span className="nb-link-label">⚙️ Admin</span>
            </a>
          </li>
        </ul>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="nb-mobile-menu"
            >
              <ul className="nb-mobile-list">
                {[
                  { label: "Home", id: "home" },
                  { label: "Life at NITJ", id: "life-at-hostels" },
                  { label: "Dignitaries", id: "director-message" },
                ].map(({ label, id }, i) => (
                  <motion.li
                    key={id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="nb-mobile-item"
                  >
                    <a
                      href={`#${id}`}
                      onClick={handleNavClick(id)}
                      className={`nb-mobile-link ${activeSection === id ? "nb-mobile-link--active" : ""}`}
                    >
                      {label}
                    </a>
                  </motion.li>
                ))}

                {/* Boys Hostels Mobile */}
                <motion.li
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="nb-mobile-item"
                >
                  <button
                    onClick={toggleDropdown("boys")}
                    className="nb-mobile-toggle"
                  >
                    <span>Boys Hostels</span>
                    <ChevronIcon open={isBoysOpen} />
                  </button>
                  <AnimatePresence>
                    {isBoysOpen && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        className="nb-mobile-sub"
                      >
                        {boysHostels.map((h) => (
                          <li key={h.key}>
                            <a
                              href={`/${h.key}`}
                              onClick={handleHostelClick(h.key)}
                              className="nb-mobile-sub-link"
                            >
                              <span className="nb-dropdown-dot" />
                              {h.name}
                            </a>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.li>

                {/* Girls Hostels Mobile */}
                <motion.li
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className="nb-mobile-item"
                >
                  <button
                    onClick={toggleDropdown("girls")}
                    className="nb-mobile-toggle"
                  >
                    <span>Girls Hostels</span>
                    <ChevronIcon open={isGirlsOpen} />
                  </button>
                  <AnimatePresence>
                    {isGirlsOpen && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        className="nb-mobile-sub"
                      >
                        {girlsHostels.map((h) => (
                          <li key={h.key}>
                            <a
                              href={`/${h.key}`}
                              onClick={handleHostelClick(h.key)}
                              className="nb-mobile-sub-link"
                            >
                              <span className="nb-dropdown-dot" />
                              {h.name}
                            </a>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.li>

                {/* Admin Portal Mobile Link */}
                <motion.li
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="nb-mobile-item"
                >
                  <a
                    href="/admin"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/admin');
                      closeAllMenus();
                    }}
                    className="nb-mobile-link"
                    style={{ color: '#1a56db', fontWeight: 600 }}
                  >
                    ⚙️ Admin Portal
                  </a>
                </motion.li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};