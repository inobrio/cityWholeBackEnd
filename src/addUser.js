const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Model yolunuza göre ayarlayın
require('dotenv').config();

async function updatePassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash('123', 10);
    await User.updateOne({ username: 'admin' }, { password: hashedPassword });

    console.log('Şifre başarıyla güncellendi!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Bir hata oluştu:', error);
    mongoose.connection.close();
  }
}

updatePassword();
