import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// สร้าง storage แยกตามประเภท
function makeStorage(dir) {
  // สร้างโฟลเดอร์ถ้ายังไม่มี
  fs.mkdirSync(dir, { recursive: true });
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || '') || '.jpg';
      const name = Date.now() + '_' + Math.random().toString(36).slice(2) + ext;
      cb(null, name);
    }
  });
}

const imageFilter = (_req, file, cb) => {
  if (!/^image\//.test(file.mimetype)) return cb(new Error('Only image files allowed'), false);
  cb(null, true);
};

export const uploadAvatar = multer({
  storage: makeStorage(path.join(__dirname, '..', 'uploads', 'avatars')),
  fileFilter: imageFilter,
  limits: { fileSize: 3 * 1024 * 1024 }
});

export const uploadEmployeePhoto = multer({
  storage: makeStorage(path.join(__dirname, '..', 'uploads', 'employees')),
  fileFilter: imageFilter,
  limits: { fileSize: 3 * 1024 * 1024 }
});

