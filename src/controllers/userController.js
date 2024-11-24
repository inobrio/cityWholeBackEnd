const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Kullanıcı Girişi
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log('Kullanıcı bulunamadı');
      return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });
    }

    console.log('Girilen Şifre:', password);
    console.log('Veritabanındaki Hash:', user.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Doğrulama Sonucu:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Şifre yanlış!' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Token:', token);

    res.status(200).json({ message: 'Giriş başarılı!', token });
  } catch (error) {
    console.error('Hata:', error);
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Kullanıcı Ekleme (Sadece Admin)
exports.createUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Kullanıcı var mı kontrol et
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Bu kullanıcı zaten mevcut!' });

    // Şifreyi hashle ve kullanıcıyı oluştur
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'Kullanıcı başarıyla eklendi!', user });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Kullanıcı Güncelleme (Sadece Admin)
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Yetkiniz yok!' });
  }

  try {
    const updatedData = {};
    if (username) updatedData.username = username;
    if (password) updatedData.password = await bcrypt.hash(password, 10);
    if (role) updatedData.role = role;

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });

    res.status(200).json({ message: 'Kullanıcı başarıyla güncellendi!', updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Kullanıcı Silme (Sadece Admin)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Yetkiniz yok!' });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });

    res.status(200).json({ message: 'Kullanıcı başarıyla silindi!', deletedUser });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};
