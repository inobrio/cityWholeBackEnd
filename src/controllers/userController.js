const User = require('../models/user'); // User modelinizi doğru yoldan alın
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Kullanıcı Girişi
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });

    // Şifre Doğrulama
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Geçersiz şifre!' });

    // JWT Token oluştur
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Giriş başarılı!', token });
  } catch (error) {
    console.error('Giriş Hatası:', error);
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Kullanıcı Ekleme
exports.createUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Kullanıcı var mı kontrol et
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Bu kullanıcı zaten mevcut!' });

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashlenmiş Şifre (Kayıt Anında):', hashedPassword);

    // Yeni kullanıcıyı oluştur ve kaydet
    const user = new User({ username, password: hashedPassword, role });
    console.log('Kaydedilecek Kullanıcı:', user);
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
