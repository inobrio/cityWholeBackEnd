const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); // .env dosyasını src'nin üstünden yükle

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE, // SMTP sunucusu
  port: 465, // TLS portu
  secure: true, // SSL yerine TLS
  auth: {
    user: process.env.EMAIL_USER, // E-posta adresi
    pass: process.env.EMAIL_PASS  // E-posta şifresi
  },
  tls: {
    rejectUnauthorized: false // Sertifika doğrulamasını devre dışı bırak
  },
  logger: true, // Loglama modunu etkinleştir
  debug: true   // Hata ayıklama modunu etkinleştir
});

module.exports = transporter;
