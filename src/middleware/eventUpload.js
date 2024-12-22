// middlewares/eventUpload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Yükleme dizinini kontrol et, yoksa oluştur
const uploadDirectory = path.join(__dirname, '../uploads/event');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Dosya depolama ayarları
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory); // Dosyaların yükleneceği klasör
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname).toLowerCase());
  }
});

// Dosya filtreleme
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Yalnızca JPG, JPEG, PNG ve WEBP formatlarında dosyalar yüklenebilir.'), false);
  }
};

// Maksimum dosya boyutu (5MB)
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

module.exports = upload;
