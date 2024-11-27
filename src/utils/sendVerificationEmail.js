const transporter = require('./transporter');

const sendVerificationEmail = async (to, subject, htmlContent) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // Gönderici adresi
      to, // Alıcı adresi
      subject, // E-posta başlığı
      html: htmlContent // HTML içeriği
    });
    console.log(`E-posta başarıyla gönderildi: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('E-posta gönderme hatası:', error);
    throw new Error('E-posta gönderimi başarısız oldu.');
  }
};

module.exports = sendVerificationEmail;
