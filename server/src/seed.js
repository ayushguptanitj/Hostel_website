// Creates admin accounts that don't exist yet. Existing accounts/passwords are left untouched.
import crypto from 'node:crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from './models/Admin.js';
import { PORTALS } from './portals.js';

await mongoose.connect(process.env.MONGODB_URI);

const created = [];
for (const p of PORTALS) {
  if (await Admin.exists({ key: p.key })) continue;
  const password = process.env.SEED_DEFAULT_PASSWORD || crypto.randomBytes(6).toString('base64url');
  await Admin.create({ ...p, passwordHash: await bcrypt.hash(password, 10) });
  created.push({ portal: p.name, loginId: p.loginId, password });
}

if (created.length) {
  console.log('Created admin accounts — share these privately and change them after first login:');
  console.table(created);
} else {
  console.log('All admin accounts already exist; nothing to do.');
}
await mongoose.disconnect();
