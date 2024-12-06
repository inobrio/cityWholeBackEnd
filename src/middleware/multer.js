const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

// Yükleme hedefi ve dosya adı
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Yolu kesin olarak belirtmek için __dirname'i kullanıyoruz ve src/uploads/city-images klasörüne kaydediyoruz
    cb(null, path.join(__dirname, '..', 'uploads', 'city-images'));
  },
  filename: (req, file, cb) => {
    const hash = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${hash}${ext}`);
  },
});

// Yükleyici tanımlaması
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Sadece jpeg, jpg ve png formatları destekleniyor!'), false);
    }
  },
});

module.exports = upload;
