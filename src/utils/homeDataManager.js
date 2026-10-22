import { apiRequest } from './api';

/**
 * Default Homepage Content Configuration
 */
export const DEFAULT_HOME_CONTENT = {
  hero: {
    welcome: 'Welcome to',
    title: 'NITJ Hostels',
    subtitle: 'Where Education Meets Community Living',
    exploreBtnText: 'Explore Hostels',
    bgImage: '',
  },
  features: [
    {
      id: 1,
      title: 'Vibrant Community',
      desc: 'Join a diverse community of students from across India',
      icon: 'fas fa-users',
    },
    {
      id: 2,
      title: 'Study Environment',
      desc: 'Dedicated study spaces and 24/7 library access',
      icon: 'fas fa-book',
    },
    {
      id: 3,
      title: 'Sports Facilities',
      desc: 'Multiple sports courts and fitness areas',
      icon: 'fas fa-basketball-ball',
    },
    {
      id: 4,
      title: 'Dining Facilities',
      desc: 'Quality food with multiple meal options',
      icon: 'fas fa-utensils',
    },
  ],
  stats: [
    { id: 1, number: '5000+', label: 'Happy Students' },
    { id: 2, number: '15', label: 'Hostel Blocks' },
    { id: 3, number: '24/7', label: 'Security' },
    { id: 4, number: '100%', label: 'WiFi Coverage' },
  ],
  director: {
    name: 'Prof. Binod Kumar Kanaujia',
    title: 'Director, NIT Jalandhar',
    image: '',
    messageParagraphs: [
      'It gives me immense pleasure to welcome you to the hostels of the National Institute of Technology, Jalandhar. Our hostels are not merely places of residence but vibrant communities that foster holistic development.',
      'We strive to provide our students with a comfortable, secure, and conducive environment for learning and personal growth. With modern amenities, active sports facilities, and comprehensive dining arrangements, we ensure that your stay is memorable and productive.',
      'I encourage all residents to embrace this opportunity to build lifelong friendships, learn cultural diversity, and contribute positively to our campus community.',
    ],
  },
  dsw: {
    name: 'Prof. Shailendra Bajpai',
    title: 'Dean Student Welfare, NITJ',
    image: '/images/dsw.jpg',
    messageParagraphs: [
      'It is my pleasure to welcome you to the hostel community of Dr. B R Ambedkar National Institute of Technology Jalandhar.',
      'Living in a hostel is a unique experience that teaches independence, camaraderie, and mutual respect. The Office of the Dean Student Welfare is dedicated to ensuring that your time in the hostels is safe, supportive, and enriching.',
      'We provide various platforms for cultural, sports, and technical activities to help you realize your potential outside the classroom. Do reach out to our team whenever you need guidance or support.',
    ],
  },
  chiefWarden: {
    name: 'Dr. Samayveer Singh',
    title: 'Associate Dean Hostel, NITJ',
    image: '/images/associate_dean.png',
    messageParagraphs: [
      'Welcome to our hostel community! We are committed to providing a safe, comfortable, and nurturing environment that fosters personal growth and academic excellence. Our team is dedicated to supporting you throughout your stay, ensuring you feel at home and have access to the resources you need to succeed.',
      'Together with the wardens, hostel staff, and student committees, we maintain round-the-clock facilities, hygiene standards, and security protocols across all hostel blocks.',
      'Make the best use of the facilities, respect your peers, and make your hostel life an unforgettable chapter of your education.',
    ],
  },
};

const mergeWithDefaults = (parsed) => ({
  ...DEFAULT_HOME_CONTENT,
  ...parsed,
  hero: { ...DEFAULT_HOME_CONTENT.hero, ...(parsed.hero || {}) },
  features: parsed.features || DEFAULT_HOME_CONTENT.features,
  stats: parsed.stats || DEFAULT_HOME_CONTENT.stats,
  director: { ...DEFAULT_HOME_CONTENT.director, ...(parsed.director || {}) },
  dsw: { ...DEFAULT_HOME_CONTENT.dsw, ...(parsed.dsw || {}) },
  chiefWarden: { ...DEFAULT_HOME_CONTENT.chiefWarden, ...(parsed.chiefWarden || {}) },
});

// undefined = not fetched yet, null = backend has no custom content (use defaults)
let cached;
let inflight = null;

const broadcast = () =>
  window.dispatchEvent(
    new CustomEvent('homeDataUpdated', {
      detail: { timestamp: Date.now() },
    })
  );

/**
 * Fetch the latest homepage content from the backend and notify listeners.
 */
export const fetchHomeData = () => {
  if (inflight) return inflight;
  inflight = apiRequest('/content/home')
    .then((res) => {
      cached = res.data;
    })
    .catch((err) => {
      // 404 = no custom content yet; any other failure (e.g. API down) also falls back to defaults
      if (err.status !== 404) console.error('Error fetching homepage data:', err);
      cached = null;
    })
    .then(() => {
      inflight = null;
      broadcast();
      return getHomeData({ refresh: false });
    });
  return inflight;
};

/**
 * Retrieve homepage content synchronously (backend data if loaded, otherwise defaults).
 * The first call triggers a background fetch; listen for `homeDataUpdated` to re-render.
 */
export const getHomeData = ({ refresh = true } = {}) => {
  if (refresh && cached === undefined) fetchHomeData();
  if (cached) return mergeWithDefaults(cached);
  return JSON.parse(JSON.stringify(DEFAULT_HOME_CONTENT));
};

/**
 * Save updated homepage content to the backend and dispatch custom event
 */
export const saveHomeData = async (updatedData) => {
  if (!updatedData) return { success: false, message: 'Nothing to save.' };
  try {
    const res = await apiRequest('/content/home', { method: 'PUT', body: { data: updatedData }, auth: true });
    cached = res.data;
    broadcast();
    return { success: true };
  } catch (err) {
    console.error('Error saving homepage data:', err);
    return { success: false, message: err.message };
  }
};

/**
 * Reset homepage content to default
 */
export const resetHomeData = async () => {
  try {
    await apiRequest('/content/home', { method: 'DELETE', auth: true });
    cached = null;
    broadcast();
    return getHomeData();
  } catch (err) {
    console.error('Error resetting homepage data:', err);
    return null;
  }
};

/**
 * Export homepage content as JSON string
 */
export const exportHomeDataJSON = () => {
  return JSON.stringify(getHomeData(), null, 2);
};
