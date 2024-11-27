const admin = require('../config/firebaseAdmin');

const sendNotification = async (deviceTokens, title, body, data = {}) => {
  try {
    const message = {
      notification: {
        title,
        body,
      },
      data, // Ek veri göndermek için
      tokens: deviceTokens, // Cihaz tokenlarını liste olarak gönderin
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log('Bildirim başarıyla gönderildi:', response);
    return response;
  } catch (error) {
    console.error('Bildirim Gönderme Hatası:', error);
    throw error;
  }
};

module.exports = sendNotification;
