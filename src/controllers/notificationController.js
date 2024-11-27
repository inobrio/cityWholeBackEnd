const sendNotification = require('../utils/sendNotification');

exports.sendNotificationToUsers = async (req, res) => {
  const { deviceTokens, title, body, data } = req.body;

  if (!deviceTokens || deviceTokens.length === 0) {
    return res.status(400).json({ message: 'Cihaz tokenları gerekli!' });
  }

  try {
    const response = await sendNotification(deviceTokens, title, body, data);
    res.status(200).json({ message: 'Bildirim gönderildi!', response });
  } catch (error) {
    res.status(500).json({ message: 'Bildirim gönderilirken bir hata oluştu.', error });
  }
};
