const User = require('../models/user'); // User modelinizi doğru yoldan alın
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Kullanıcı Girişi
// Kullanıcı Girişi
exports.login = async (req, res) => {
  const { identifier, password } = req.body; // identifier: username, email veya phone olabilir.

  try {
    // Kullanıcıyı bul: username, email veya phone üzerinden
    const user = await User.findOne({
      $or: [
        { username: identifier },
        { email: identifier },
        { phone: identifier }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });
    }

    // Şifre Doğrulama
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Geçersiz şifre!' });
    }

    // JWT Token oluştur
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Giriş başarılı!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Giriş Hatası:', error);
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};


// Kullanıcı Ekleme
exports.createUser = async (req, res) => {
  const { username, password, role, email, name, surname, phone } = req.body;

  try {
    // Eksik alanları kontrol et
    if (!name || !surname) {
      return res.status(400).json({ message: 'Ad (name) ve soyad (surname) alanları zorunludur!' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Bu kullanıcı zaten mevcut!' });

    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) return res.status(400).json({ message: 'Bu e-posta zaten kullanılıyor!' });
    }

    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) return res.status(400).json({ message: 'Bu telefon numarası zaten kullanılıyor!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role, email, name, surname, phone });
    await user.save();

    res.status(201).json({ message: 'Kullanıcı başarıyla eklendi!', user });
  } catch (error) {
    console.error('Kullanıcı Ekleme Hatası:', error);
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};



// Tüm Kullanıcıları Listele (Sadece Admin)
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Şifreyi yanıtlamaz
    res.status(200).json(users);
  } catch (error) {
    console.error('Kullanıcı Listeleme Hatası:', error);
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Kullanıcı Güncelleme
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;

  try {
    const updatedData = {};
    if (username) updatedData.username = username;
    if (password) updatedData.password = await bcrypt.hash(password, 10);
    if (role) updatedData.role = role;

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });

    res.status(200).json({ message: 'Kullanıcı başarıyla güncellendi!', updatedUser });
  } catch (error) {
    console.error('Kullanıcı Güncelleme Hatası:', error);
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};
