import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs';
import path from 'node:path';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
  fileFilter: (_req, file, cb) =>
    (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf')
      ? cb(null, true)
      : cb(new Error('Only image and PDF files are allowed')),
});

router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  // 1. Attempt upload to Cloudinary if keys are configured
  if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_CLOUD_NAME) {
    try {
      const folder = `nitj-hostel/${req.admin?.key || 'general'}`;
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder, resource_type: 'auto' }, (err, out) => (err ? reject(err) : resolve(out)))
          .end(req.file.buffer);
      });
      return res.json({ url: result.secure_url, publicId: result.public_id });
    } catch (err) {
      console.warn('Cloudinary upload error, using local storage fallback:', err.message);
    }
  }

  // 2. Fallback: Save directly to public/images/uploads/ directory
  try {
    const uploadsDir = path.resolve(process.cwd(), '../public/images/uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const ext = path.extname(req.file.originalname) || (req.file.mimetype === 'application/pdf' ? '.pdf' : '.jpg');
    const cleanName = path.basename(req.file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${cleanName}-${Date.now()}${ext}`;
    const targetPath = path.join(uploadsDir, filename);
    await fs.promises.writeFile(targetPath, req.file.buffer);
    return res.json({ url: `/images/uploads/${filename}` });
  } catch (localErr) {
    console.warn('Local disk write failed, using data URI fallback:', localErr.message);
    // 3. Fallback: Return in-memory Base64 Data URL
    const mime = req.file.mimetype || 'image/jpeg';
    const base64 = req.file.buffer.toString('base64');
    return res.json({ url: `data:${mime};base64,${base64}` });
  }
});

export default router;
