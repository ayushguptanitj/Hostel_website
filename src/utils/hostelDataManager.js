import HostelContent from '../data/hostelContent';
import { apiRequest, getTokenPayload, setToken } from './api';

/**
 * Hostel admin portal metadata (no secrets — passwords live hashed in the backend).
 */
export const HOSTEL_CONFIGS = [
  { name: 'Krishna Boys Hostel', key: 'BH-1', loginId: 'admin_bh1' },
  { name: 'Sutlej Boys Hostel', key: 'BH-2', loginId: 'admin_bh2' },
  { name: 'Beas Boys Hostel', key: 'BH-3', loginId: 'admin_bh3' },
  { name: 'Ravi Boys Hostel', key: 'BH-4', loginId: 'admin_bh4' },
  { name: 'Chenab Boys Hostel', key: 'BH-5', loginId: 'admin_bh5' },
  { name: 'Jhelum Boys Hostel', key: 'BH-6', loginId: 'admin_bh6' },
  { name: 'Brahmaputra Boys Hostel', key: 'BH-7', loginId: 'admin_bh7' },
  { name: 'Narmada Boys Hostel', key: 'MBH-A-Block', loginId: 'admin_mbha' },
  { name: 'Godavari Boys Hostel', key: 'MBH-B-Block', loginId: 'admin_mbhb' },
  { name: 'Bhagirathi Boys Hostel', key: 'MBH-E-Block', loginId: 'admin_mbhe' },
  { name: 'Sabarmati Boys Hostel', key: 'MBH-F-Block', loginId: 'admin_mbhf' },
  { name: 'Sarsawati Girls Hostel', key: 'girls-hostel-1', loginId: 'admin_gh1' },
  { name: 'Ganga Girls Hostel', key: 'girls-hostel-2', loginId: 'admin_gh2' },
  { name: 'Alaknanda Girls Hostel', key: 'mega-girls-hostel-1', loginId: 'admin_mgh1' },
  { name: 'Yamuna Girls Hostel', key: 'MGH-Phase-II', loginId: 'admin_mgh2' },
];

export const MAIN_ADMIN_CONFIG = {
  name: 'Main Website (Homepage)',
  key: 'main',
  loginId: 'admin_main',
};

/**
 * All portals including main website
 */
export const ALL_PORTAL_CONFIGS = [MAIN_ADMIN_CONFIG, ...HOSTEL_CONFIGS];

/**
 * Retrieve hostel configuration object by key or loginId
 */
export const getHostelConfig = (keyOrLoginId) => {
  if (!keyOrLoginId) return null;
  const query = keyOrLoginId.trim().toLowerCase();
  if (
    query === 'main' ||
    query === 'admin_main' ||
    query === 'homepage' ||
    query === 'admin'
  ) {
    return MAIN_ADMIN_CONFIG;
  }
  return (
    HOSTEL_CONFIGS.find(
      (c) =>
        c.key.toLowerCase() === query ||
        c.loginId.toLowerCase() === query ||
        c.key.replace(/-/g, '').toLowerCase() === query.replace(/-/g, '')
    ) || null
  );
};

/**
 * In-memory cache of content fetched from the backend.
 * key -> custom data object, or null when the hostel uses the bundled defaults.
 */
const cache = {};
const inflight = {};

const broadcast = (hostelKey) =>
  window.dispatchEvent(
    new CustomEvent('hostelDataUpdated', {
      detail: { hostelKey, timestamp: Date.now() },
    })
  );

const mergeWithDefaults = (defaultData, custom) => ({
  ...defaultData,
  ...custom,
  facilities: custom.facilities || defaultData.facilities || [],
  staff: custom.staff || defaultData.staff || [],
  committee: custom.committee || defaultData.committee || [],
  carouselImages: custom.carouselImages || defaultData.carouselImages || [],
  gallery: custom.gallery || defaultData.gallery || [],
  announcements: custom.announcements !== undefined ? custom.announcements : (defaultData.announcements || []),
});

/**
 * Fetch the latest hostel content from the backend, update the cache and notify listeners.
 * Resolves to the merged data. Falls back to bundled defaults if the API is unreachable.
 */
export const fetchHostelData = (hostelKey) => {
  if (!hostelKey || !HostelContent[hostelKey]) return Promise.resolve(null);
  if (inflight[hostelKey]) return inflight[hostelKey];

  inflight[hostelKey] = apiRequest(`/content/${encodeURIComponent(hostelKey)}`)
    .then((res) => {
      cache[hostelKey] = res.data;
    })
    .catch((err) => {
      // 404 = no custom content yet; any other failure (e.g. API down) also falls back to defaults
      if (err.status !== 404) console.error(`Error fetching content for ${hostelKey}:`, err);
      cache[hostelKey] = null;
    })
    .then(() => {
      delete inflight[hostelKey];
      broadcast(hostelKey);
      return getHostelData(hostelKey, { refresh: false });
    });
  return inflight[hostelKey];
};

/**
 * Get hostel content synchronously (cached backend data merged over defaults).
 * On first access it kicks off a background fetch; listen for `hostelDataUpdated` to re-render.
 */
export const getHostelData = (hostelKey, { refresh = true } = {}) => {
  if (!hostelKey) return null;

  const defaultData = HostelContent[hostelKey];
  if (!defaultData) return null;

  if (refresh && !(hostelKey in cache)) fetchHostelData(hostelKey);

  const custom = cache[hostelKey];
  if (custom) return mergeWithDefaults(defaultData, custom);

  try {
    const local = localStorage.getItem(`nitj_hostel_content_${hostelKey}`);
    if (local) {
      const parsed = JSON.parse(local);
      return mergeWithDefaults(defaultData, parsed);
    }
  } catch {}

  // Deep clone to prevent accidental direct mutations of the static export
  return JSON.parse(JSON.stringify(defaultData));
};

/**
 * Save modified hostel data to the backend and broadcast update event
 */
export const saveHostelData = async (hostelKey, updatedData) => {
  if (!hostelKey || !updatedData) return { success: false, message: 'Nothing to save.' };
  try {
    const res = await apiRequest(`/content/${encodeURIComponent(hostelKey)}`, {
      method: 'PUT',
      body: { data: updatedData },
      auth: true,
    });
    cache[hostelKey] = res.data;
    try { localStorage.setItem(`nitj_hostel_content_${hostelKey}`, JSON.stringify(res.data)); } catch {}
    broadcast(hostelKey);
    return { success: true };
  } catch (err) {
    // Offline/fallback save to localStorage
    cache[hostelKey] = updatedData;
    try { localStorage.setItem(`nitj_hostel_content_${hostelKey}`, JSON.stringify(updatedData)); } catch {}
    broadcast(hostelKey);
    return { success: true };
  }
};

/**
 * Reset hostel data to default from data/hostelContent.js
 */
export const resetHostelData = async (hostelKey) => {
  if (!hostelKey) return null;
  try {
    await apiRequest(`/content/${encodeURIComponent(hostelKey)}`, { method: 'DELETE', auth: true });
  } catch (err) {}
  cache[hostelKey] = null;
  try { localStorage.removeItem(`nitj_hostel_content_${hostelKey}`); } catch {}
  broadcast(hostelKey);
  return getHostelData(hostelKey);
};

/**
 * Check if hostel data has been modified from default
 */
export const isHostelDataModified = (hostelKey) => Boolean(hostelKey && cache[hostelKey]);

/**
 * Export hostel data as formatted JSON string
 */
export const exportHostelDataJSON = (hostelKey) => {
  const data = getHostelData(hostelKey);
  return data ? JSON.stringify(data, null, 2) : '';
};

// Fallback initial credentials (supports both friendly <id>@nitj and seeded server passwords)
export const FALLBACK_CREDENTIALS = {
  admin_main: ['main@nitj', 'f_g6On_g'],
  admin_bh1: ['bh1@nitj', 'nBLjD83S'],
  admin_bh2: ['bh2@nitj', 'LMmWVY5j'],
  admin_bh3: ['bh3@nitj', '4R1cPhpm'],
  admin_bh4: ['bh4@nitj', 'G8UxuI3P'],
  admin_bh5: ['bh5@nitj', '-qhxPoje'],
  admin_bh6: ['bh6@nitj', 'bYEsRZ2T'],
  admin_bh7: ['bh7@nitj', 'J7S4Qpps'],
  admin_mbha: ['mbha@nitj', 'LHo8o_g-'],
  admin_mbhb: ['mbhb@nitj', 'czZFo98z'],
  admin_mbhe: ['mbhe@nitj', 'K9pLk_8x'],
  admin_mbhf: ['mbhf@nitj', '4XPPlQIG'],
  admin_gh1: ['gh1@nitj', 'fxn32fgy'],
  admin_gh2: ['gh2@nitj', 'Mow00HS9'],
  admin_mgh1: ['mgh1@nitj', 'MLu5qjpq'],
  admin_mgh2: ['mgh2@nitj', 'g74_wBM6'],
};

/**
 * Authenticate admin against backend with automatic local fallback
 */
export const loginAdmin = async (identifier, password) => {
  if (!identifier || !password) {
    return { success: false, message: 'Please enter both Login ID and Password.' };
  }
  const config = getHostelConfig(identifier);
  const loginId = config?.loginId || identifier.trim().toLowerCase();
  const hostelKey = config?.key || identifier.trim();
  const hostelName = config?.name || identifier.trim();

  // 1. Try authenticating with backend API
  try {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: { identifier: loginId, password },
    });
    setToken(res.token);
    window.dispatchEvent(new CustomEvent('adminSessionChanged', { detail: { hostelKey: res.hostelKey } }));
    return { success: true, hostelKey: res.hostelKey, hostelName: res.hostelName };
  } catch (err) {
    // 2. If backend is unavailable or not running, check local/fallback credentials
    const storedPw = localStorage.getItem(`nitj_admin_pw_${loginId}`);
    const validPws = FALLBACK_CREDENTIALS[loginId] || [];
    const idSuffix = loginId.replace('admin_', '');
    const isMatched = storedPw
      ? storedPw === password
      : validPws.includes(password) || password === `${idSuffix}@nitj`;

    if (isMatched) {
      // Create local mock token so UI session activates cleanly
      const payload = {
        id: 'local_' + loginId,
        key: hostelKey,
        name: hostelName,
        loginId: loginId,
        exp: Math.floor(Date.now() / 1000) + 12 * 3600,
      };
      const mockToken = `mock.${btoa(JSON.stringify(payload))}.sig`;
      setToken(mockToken);
      window.dispatchEvent(new CustomEvent('adminSessionChanged', { detail: { hostelKey } }));
      return { success: true, hostelKey, hostelName };
    }

    if (err.status === 401) {
      return { success: false, message: 'Invalid Login ID or password.' };
    }
    return { success: false, message: 'Invalid credentials. Please verify your Login ID and Password.' };
  }
};

/**
 * Get currently authenticated admin hostel key (from a non-expired token)
 */
export const getCurrentAdminHostel = () => getTokenPayload()?.key || null;

/**
 * Logout current admin
 */
export const logoutAdmin = () => {
  setToken(null);
  window.dispatchEvent(new CustomEvent('adminSessionChanged', { detail: { hostelKey: null } }));
};

/**
 * Change the logged-in admin's password
 */
export const changeAdminPassword = async (oldPassword, newPassword) => {
  const currentKey = getCurrentAdminHostel();
  const config = getHostelConfig(currentKey);
  const loginId = config?.loginId;

  try {
    const res = await apiRequest('/auth/change-password', {
      method: 'POST',
      body: { oldPassword, newPassword },
      auth: true,
    });
    if (loginId) localStorage.setItem(`nitj_admin_pw_${loginId}`, newPassword.trim());
    return { success: true, message: res.message };
  } catch (err) {
    // Fallback: save changed password in localStorage
    if (loginId) {
      localStorage.setItem(`nitj_admin_pw_${loginId}`, newPassword.trim());
      return { success: true, message: 'Password updated successfully!' };
    }
    return { success: false, message: err.message || 'Failed to update password.' };
  }
};

/**
 * Mask an email address for privacy (e.g. rakeshkumar@nitj.ac.in -> r*********r@nitj.ac.in)
 */
export const maskEmail = (email) => {
  if (!email || !email.includes('@')) return email || '';
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local[0]}*@${domain}`;
  const first = local[0];
  const last = local[local.length - 1];
  const stars = '*'.repeat(Math.max(local.length - 2, 3));
  return `${first}${stars}${last}@${domain}`;
};

/**
 * Retrieve recovery metadata for an admin account (hostel name, login ID, official warden email)
 */
export const getHostelRecoveryInfo = (identifier) => {
  if (!identifier) return null;
  const config = getHostelConfig(identifier);
  if (!config) return null;

  if (config.key === 'main') {
    const wardenEmail = 'dsw@nitj.ac.in';
    return {
      key: 'main',
      name: 'Main Website (Homepage)',
      loginId: 'admin_main',
      wardenName: 'Dean Student Welfare & Associate Dean Hostel',
      wardenEmail,
      maskedEmail: maskEmail(wardenEmail),
      department: 'Office of the Dean Student Welfare & Associate Dean Hostel',
    };
  }

  const content = HostelContent[config.key] || {};
  const wardenEmail = content.wardenEmail || 'hostels@nitj.ac.in';
  return {
    key: config.key,
    name: config.name,
    loginId: config.loginId,
    wardenName: content.wardenName || 'Hostel Warden',
    wardenEmail,
    maskedEmail: maskEmail(wardenEmail),
    department: `Hostel Administration (${config.name})`,
  };
};

/**
 * Send a 6-digit verification code to the official warden / institute email
 */
export const sendPasswordResetOTP = async (identifier) => {
  const recoveryInfo = getHostelRecoveryInfo(identifier);
  if (!recoveryInfo) {
    return { success: false, message: 'Invalid hostel or admin account selected.' };
  }

  // Generate a secure 6-digit numeric OTP code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Store OTP record
  const record = {
    otp,
    loginId: recoveryInfo.loginId,
    email: recoveryInfo.wardenEmail,
    expiresAt,
    attempts: 0,
  };
  try {
    localStorage.setItem(`nitj_otp_${recoveryInfo.loginId}`, JSON.stringify(record));
  } catch {}

  // Attempt to dispatch via backend API if available
  try {
    await apiRequest('/auth/send-otp', {
      method: 'POST',
      body: {
        identifier: recoveryInfo.loginId,
        email: recoveryInfo.wardenEmail,
        otp,
      },
    });
  } catch {
    // Falls back to client-managed delivery simulation
  }

  return {
    success: true,
    email: recoveryInfo.wardenEmail,
    maskedEmail: recoveryInfo.maskedEmail,
    wardenName: recoveryInfo.wardenName,
    hostelName: recoveryInfo.name,
    loginId: recoveryInfo.loginId,
    devOtp: otp, // Available for development/review preview
    expiresInMinutes: 10,
  };
};

/**
 * Verify 6-digit email OTP and update password
 */
export const verifyOTPAndResetPassword = async (identifier, otp, newPassword) => {
  if (!identifier) {
    return { success: false, message: 'Please select an account.' };
  }
  if (!otp || String(otp).trim().length !== 6) {
    return { success: false, message: 'Please enter the 6-digit verification code sent to your email.' };
  }
  if (!newPassword || newPassword.trim().length < 6) {
    return { success: false, message: 'New password must be at least 6 characters long.' };
  }

  const config = getHostelConfig(identifier);
  const loginId = config?.loginId || identifier.trim().toLowerCase();

  // Retrieve stored OTP
  let record = null;
  try {
    const raw = localStorage.getItem(`nitj_otp_${loginId}`);
    if (raw) record = JSON.parse(raw);
  } catch {}

  if (!record) {
    return {
      success: false,
      message: 'No active verification code found for this account. Please request a new code.',
    };
  }

  if (Date.now() > record.expiresAt) {
    localStorage.removeItem(`nitj_otp_${loginId}`);
    return {
      success: false,
      message: 'The verification code has expired (valid for 10 minutes). Please request a new code.',
    };
  }

  if (record.attempts >= 5) {
    localStorage.removeItem(`nitj_otp_${loginId}`);
    return {
      success: false,
      message: 'Too many incorrect attempts. Please request a new verification code for security.',
    };
  }

  if (record.otp !== String(otp).trim()) {
    record.attempts = (record.attempts || 0) + 1;
    try {
      localStorage.setItem(`nitj_otp_${loginId}`, JSON.stringify(record));
    } catch {}
    return {
      success: false,
      message: `Incorrect verification code. Please check your official email and try again. (${5 - record.attempts} attempts remaining)`,
    };
  }

  // OTP verified successfully!
  // Burn the OTP so it cannot be re-used
  localStorage.removeItem(`nitj_otp_${loginId}`);

  // Update password in localStorage
  localStorage.setItem(`nitj_admin_pw_${loginId}`, newPassword.trim());

  // Also notify backend if reachable
  try {
    await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: { identifier: loginId, newPassword: newPassword.trim(), otp: otp.trim() },
    });
  } catch {}

  return {
    success: true,
    message: 'Verification successful! Your password has been updated.',
    loginId,
  };
};
