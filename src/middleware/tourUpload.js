const multer = require('multer');
const path = require('path');
const fs = require('fs');

// uploads/tours klasörünün varlığını kontrol et ve yoksa oluştur
const uploadDir = path.join(__dirname, '../uploads/tours');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Disk Storage Ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `tour-${uniqueSuffix}${ext}`);
  },
});

// Sadece belirli dosya türlerine izin ver
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Sadece jpg, png veya webp formatına izin verilir!'), false);
  }
};

// Multer örneği oluştur
const tourUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Opsiyonel: 5MB
});

module.exports = tourUpload;
