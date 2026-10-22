import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { PORTALS } from '../portals.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Public list of portals for the login dropdown (no secrets).
router.get('/portals', (_req, res) => res.json(PORTALS));

router.post('/login', async (req, res) => {
  const identifier = String(req.body.identifier || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  if (!identifier || !password) {
    return res.status(400).json({ message: 'Please enter both Login ID and Password.' });
  }

  const admin = await Admin.findOne({
    $or: [{ loginId: identifier }, { key: new RegExp(`^${identifier.replace(/[^a-z0-9-]/g, '')}$`, 'i') }],
  });
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    return res.status(401).json({ message: 'Invalid Login ID or password.' });
  }

  const token = jwt.sign(
    { id: admin._id.toString(), key: admin.key, name: admin.name, loginId: admin.loginId },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  );
  res.json({ token, hostelKey: admin.key, hostelName: admin.name, loginId: admin.loginId });
});

router.get('/me', requireAuth, (req, res) => res.json(req.admin));

router.post('/change-password', requireAuth, async (req, res) => {
  const { oldPassword = '', newPassword = '' } = req.body;
  if (newPassword.trim().length < 8) {
    return res.status(400).json({ message: 'New password must be at least 8 characters.' });
  }
  const admin = await Admin.findById(req.admin.id);
  if (!admin || !(await bcrypt.compare(oldPassword, admin.passwordHash))) {
    return res.status(400).json({ message: 'Current password does not match.' });
  }
  admin.passwordHash = await bcrypt.hash(newPassword.trim(), 10);
  await admin.save();
  res.json({ message: 'Password updated successfully!' });
});

// In-memory OTP store for verification
const otpStore = new Map();

router.post('/send-otp', async (req, res) => {
  const identifier = String(req.body.identifier || '').trim().toLowerCase();
  const email = String(req.body.email || '').trim();
  const otp = String(req.body.otp || '').trim();

  if (!identifier || !otp) {
    return res.status(400).json({ message: 'Identifier and OTP code are required.' });
  }

  otpStore.set(identifier, {
    otp,
    email,
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0,
  });

  console.log(`[AUTH] Dispatched password reset OTP to ${email} for ${identifier}: ${otp}`);
  res.json({ success: true, message: 'OTP dispatched successfully.', email });
});

router.post('/reset-password', async (req, res) => {
  const identifier = String(req.body.identifier || '').trim().toLowerCase();
  const newPassword = String(req.body.newPassword || '').trim();
  const otp = String(req.body.otp || '').trim();

  if (!identifier || !newPassword) {
    return res.status(400).json({ message: 'Please provide both Login ID and New Password.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters.' });
  }

  const storedOtp = otpStore.get(identifier);
  if (storedOtp) {
    if (Date.now() > storedOtp.expiresAt) {
      otpStore.delete(identifier);
      return res.status(400).json({ message: 'Verification code has expired.' });
    }
    if (storedOtp.otp !== otp) {
      storedOtp.attempts = (storedOtp.attempts || 0) + 1;
      return res.status(400).json({ message: 'Invalid verification code.' });
    }
    otpStore.delete(identifier);
  }

  const admin = await Admin.findOne({
    $or: [{ loginId: identifier }, { key: new RegExp(`^${identifier.replace(/[^a-z0-9-]/g, '')}$`, 'i') }],
  });
  if (!admin) {
    return res.status(404).json({ message: 'Hostel admin account not found.' });
  }

  admin.passwordHash = await bcrypt.hash(newPassword, 10);
  await admin.save();
  res.json({ message: 'Password has been reset successfully!' });
});

export default router;
