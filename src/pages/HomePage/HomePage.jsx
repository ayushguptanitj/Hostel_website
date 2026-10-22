import { useEffect, useState } from 'react';
import './HomePage.css';
import WardenMessage from '../../components/home/AssociateDeanMessage';
import DirectorMessage from '../../components/home/DirectorMessage';
import HostelList from '../../components/home/HostelList';
import LifeAtHostels from "../../components/home/LifeAtHostels";
import { Navbar } from "../../components/layout/Navbar";
import megaHostelImage from '../../assets/images/mega-hostel-boys.jpg';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { DSW } from '../../components/home/DswMessage';
import { getHomeData } from '../../utils/homeDataManager';

const Homepage = () => {
    const controls = useAnimation();
    const [inView] = useInView({
        triggerOnce: true,
        threshold: 0.2
    });

    const [homeData, setHomeData] = useState(() => getHomeData());

    useEffect(() => {
        const handleUpdate = () => setHomeData(getHomeData());
        window.addEventListener('homeDataUpdated', handleUpdate);
        return () => window.removeEventListener('homeDataUpdated', handleUpdate);
    }, []);

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div>
            <Navbar />
            <div className="homepage">
                <motion.section 
                    id="home"
                    className="enhanced-hero-section page-section" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <div className="hero-overlay"></div>
                    <div className="hero-background" style={{
                        backgroundImage: `url(${homeData.hero?.bgImage || megaHostelImage})`,
                    }}></div>
                    
                    <motion.div 
                        className="hero-content"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <motion.div 
                            className="hero-text-container"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: {},
                                visible: {
                                    transition: {
                                        staggerChildren: 0.3
                                    }
                                }
                            }}
                        >
                            <motion.span 
                                className="hero-welcome"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                                }}
                            >
                                {homeData.hero?.welcome || 'Welcome to'}
                            </motion.span>
                            <motion.h1 
                                className="hero-title"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                                }}
                            >
                                {homeData.hero?.title || 'NITJ Hostels'}
                            </motion.h1>
                            <motion.p 
                                className="hero-subtitle"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                                }}
                            >
                                {homeData.hero?.subtitle || 'Where Education Meets Community Living'}
                            </motion.p>
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, scale: 0.8 },
                                    visible: { opacity: 1, scale: 1, transition: { delay: 0.2, duration: 0.5 } }
                                }}
                            >
                                <motion.a
                                    href="#hostel-list"
                                    className="explore-btn"
                                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {homeData.hero?.exploreBtnText || 'Explore Hostels'}
                                </motion.a>
                            </motion.div>
                        </motion.div>
                        
                        <motion.div 
                            className="scroll-indicator"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, y: [0, 10, 0] }}
                            transition={{ delay: 1.5, duration: 1.5, repeat: Infinity }}
                            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                        >
                            <span>Scroll Down</span>
                            <i className="fas fa-chevron-down"></i>
                        </motion.div>
                    </motion.div>
                </motion.section>

               
                <motion.section 
                    className="features-section page-section"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    <motion.h2 variants={fadeIn}>Why Choose NITJ Hostels?</motion.h2>
                    <div className="features-grid">
                        {homeData.features?.map((feat, idx) => (
                            <motion.div 
                                key={feat.id || idx}
                                className="feature-card"
                                variants={fadeIn}
                                whileHover={{ y: -10, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
                            >
                                <i className={feat.icon || 'fas fa-star'}></i>
                                <h3>{feat.title}</h3>
                                <p>{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

               
                <motion.section 
                    className="stats-section page-section"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="stats-grid">
                        {homeData.stats?.map((st, idx) => (
                            <motion.div 
                                key={st.id || idx}
                                className="stat-item"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * (idx + 1), duration: 0.5 }}
                                whileHover={{ y: -5 }}
                            >
                                <h3>{st.number}</h3>
                                <p>{st.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

               
                <section id="life-at-hostels" className="page-section">
                    <LifeAtHostels />
                </section>

               
                <section id="director-message" className="page-section">
                    <DirectorMessage />
                </section>
                <DSW/>
                <WardenMessage />
                <div id="hostel-list">
                    <HostelList />
                </div>
            </div>
            <footer className="site-footer">
                Developed by <a href="https://www.linkedin.com/in/ayushguptanitj/" target="_blank" rel="noopener noreferrer">Ayush Gupta</a>
                <span className="copyright">© 2026 NITJ Hostel Portal. All rights reserved.</span>
            </footer>
        </div>
    );
};

export default Homepage;
