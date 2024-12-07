const User = require('../models/user'); // User modelinizi doğru yoldan alın
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const sendVerificationEmail = require('../utils/sendVerificationEmail');

// Kullanıcı Girişi
exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // Kullanıcıyı username, email veya phone ile bul
    const user = await User.findOne({
      $or: [
        { username: identifier },
        { email: identifier },
        { phone: identifier }
      ]
    });

    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });

    // E-posta doğrulama kontrolü
    if (!user.isEmailVerified) {
      return res.status(403).json({ message: 'E-posta doğrulaması yapılmamış!' });
    }

    // Şifre doğrulama
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Kullanıcı adı veya şifre hatalı!' });

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

exports.getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Kullanıcı sayısı alınırken hata:', error);
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// E-posta Doğrulama
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Geçersiz veya süresi dolmuş doğrulama tokenı!' });
    }

    user.isEmailVerified = true; // E-posta doğrulandı
    user.emailVerificationToken = undefined; // Token artık gerekli değil
    await user.save();

    res.status(200).json({ message: 'E-posta başarıyla doğrulandı!' });
  } catch (error) {
    console.error('E-posta Doğrulama Hatası:', error);
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Kullanıcı Ekleme
exports.createUser = async (req, res) => {
  const { username, password, role, email, name, surname, phone } = req.body;

  try {
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

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // E-posta doğrulama token'ı oluştur
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({
      username,
      password: hashedPassword,
      role,
      email,
      name,
      surname,
      phone,
      emailVerificationToken
    });
    await user.save();

    // Doğrulama e-postasını gönder
    const verificationUrl = `http://localhost:5000/api/users/verify-email/${emailVerificationToken}`;
    await sendVerificationEmail(email, 'E-posta Doğrulama', `<a href="${verificationUrl}">${verificationUrl}</a>`);

    res.status(201).json({ message: 'Kullanıcı başarıyla eklendi ve doğrulama e-postası gönderildi!', user });
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
  const { username, password, role, email, phone, name, surname } = req.body;

  try {
    const updatedData = {};
    if (username) updatedData.username = username;
    if (password) updatedData.password = await bcrypt.hash(password, 10);
    if (role) updatedData.role = role;
    if (email) updatedData.email = email;
    if (phone) updatedData.phone = phone;
    if (name) updatedData.name = name;
    if (surname) updatedData.surname = surname;

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });

    res.status(200).json({ message: 'Kullanıcı başarıyla güncellendi!', updatedUser });
  } catch (error) {
    console.error('Kullanıcı Güncelleme Hatası:', error);
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Kullanıcı Silme
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });
    }

    res.status(200).json({ message: 'Kullanıcı başarıyla silindi!', deletedUser });
  } catch (error) {
    console.error('Kullanıcı Silme Hatası:', error);
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};


