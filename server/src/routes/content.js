import { Router } from 'express';
import Content from '../models/Content.js';
import { requireAuth, canEdit } from '../middleware/auth.js';
import { HOSTEL_KEYS } from '../portals.js';

const router = Router();

const isValidKey = (key) => key === 'home' || HOSTEL_KEYS.includes(key);

// Public: fetch page content. 404 means "not customised yet" — frontend uses bundled defaults.
router.get('/:key', async (req, res) => {
  const { key } = req.params;
  if (!isValidKey(key)) return res.status(404).json({ message: 'Unknown page' });
  const doc = await Content.findOne({ key }).lean();
  if (!doc) return res.status(404).json({ message: 'No custom content' });
  res.json({ data: doc.data, updatedAt: doc.updatedAt });
});

router.put('/:key', requireAuth, async (req, res) => {
  const { key } = req.params;
  if (!isValidKey(key)) return res.status(404).json({ message: 'Unknown page' });
  if (!canEdit(req.admin, key)) return res.status(403).json({ message: 'Not allowed to edit this page' });
  if (!req.body?.data || typeof req.body.data !== 'object') {
    return res.status(400).json({ message: 'Missing content data' });
  }
  const doc = await Content.findOneAndUpdate(
    { key },
    { data: req.body.data, updatedBy: req.admin.loginId },
    { upsert: true, new: true }
  ).lean();
  res.json({ data: doc.data, updatedAt: doc.updatedAt });
});

// Reset to defaults = delete the custom document.
router.delete('/:key', requireAuth, async (req, res) => {
  const { key } = req.params;
  if (!isValidKey(key)) return res.status(404).json({ message: 'Unknown page' });
  if (!canEdit(req.admin, key)) return res.status(403).json({ message: 'Not allowed to edit this page' });
  await Content.deleteOne({ key });
  res.json({ message: 'Reset to defaults' });
});

export default router;
