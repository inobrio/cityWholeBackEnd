const CityImage = require('../models/cityImage');
const Country = require('../models/country');
const City = require('../models/city');
const Category = require('../models/category');
const Attribute = require('../models/attribute'); // Özelliklerin referansı için

// Kent İmgesi Ekle
exports.addCityImage = async (req, res) => {
  try {
    // address ve contact alanlarını parse et
    if (typeof req.body.address === 'string') {
      req.body.address = JSON.parse(req.body.address);
    }
    if (typeof req.body.contact === 'string') {
      req.body.contact = JSON.parse(req.body.contact);
    }

    const {
      country,
      city,
      category,
      title,
      description,
      address,
      fee,
      editorNotes,
      events,
      features,
      contact,
      latitude, // Enlem
      longitude, // Boylam
    } = req.body;

    // -- Manuel ilişki kontrolleri (ülke/şehir/kategori var mı?) --
    const existingCountry = await Country.findById(country);
    if (!existingCountry) {
      return res.status(400).json({
        message: 'Validation Error',
        errors: { country: 'Geçerli bir ülke seçmelisiniz!' },
      });
    }

    const existingCity = await City.findById(city);
    if (!existingCity) {
      return res.status(400).json({
        message: 'Validation Error',
        errors: { city: 'Geçerli bir şehir seçmelisiniz!' },
      });
    }

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({
        message: 'Validation Error',
        errors: { category: 'Geçerli bir kategori seçmelisiniz!' },
      });
    }

    // -- Dosya kontrolleri --
    const coverImage = req.files.coverImage?.[0]?.path;
    const galleryImages = req.files.galleryImages?.map((file) => file.path) || [];

    if (!coverImage) {
      return res.status(400).json({
        message: 'Validation Error',
        errors: { coverImage: 'Kapak resmi yüklenmesi gerekiyor!' },
      });
    }
    if (galleryImages.length > 6) {
      return res.status(400).json({
        message: 'Validation Error',
        errors: { galleryImages: 'Maksimum 6 galeri görseli yüklenebilir!' },
      });
    }

    // -- Model dokümanı oluştur --
    const cityImage = new CityImage({
      country,
      city,
      category,
      title,
      description,
      address,
      latitude: Number(latitude),
      longitude: Number(longitude),
      fee,
      editorNotes,
      events,
      features,
      contact,
      coverImage,
      galleryImages,
    });

    // -- Kaydet (Mongoose validasyonları tetiklenir) --
    await cityImage.save();

    return res.status(201).json({
      message: 'Kent İmgesi başarıyla eklendi!',
      cityImage,
    });
  } catch (error) {
    // Mongoose Validation Error
    if (error.name === 'ValidationError') {
      const errors = {};
      for (const field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({
        message: 'Validation Error',
        errors,
      });
    }

    // Diğer hatalar
    console.error('Hata:', error);
    return res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Kent İmgelerini Listele
exports.getCityImages = async (req, res) => {
  try {
    const cityImages = await CityImage.find()
      .populate('country', 'name') // Ülke adı
      .populate('city', 'name') // Şehir adı
      .populate('category', 'name') // Kategori adı
      .populate('features'); // Özellik detayları

    return res.status(200).json(cityImages);
  } catch (error) {
    console.error('Hata:', error);
    return res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Belirli Bir Kent İmgesini Getir
exports.getCityImageById = async (req, res) => {
  const { id } = req.params;

  try {
    const cityImage = await CityImage.findById(id)
      .populate('country', 'name')
      .populate('city', 'name')
      .populate('category', 'name')
      .populate('features');

    if (!cityImage) {
      return res.status(404).json({ message: 'Kent İmgesi bulunamadı!' });
    }

    return res.status(200).json(cityImage);
  } catch (error) {
    console.error('Hata:', error);
    return res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Kent İmgesini Güncelle
exports.updateCityImage = async (req, res) => {
  try {
    // address ve contact alanlarını parse et
    if (typeof req.body.address === 'string') {
      req.body.address = JSON.parse(req.body.address);
    }
    if (typeof req.body.contact === 'string') {
      req.body.contact = JSON.parse(req.body.contact);
    }

    const { id } = req.params;
    const updateData = { ...req.body };

    // Gelen dosyaları al
    if (req.files?.coverImage) {
      updateData.coverImage = req.files.coverImage[0].path;
    }
    if (req.files?.galleryImages) {
      updateData.galleryImages = req.files.galleryImages.map((file) => file.path);
    }

    // Sayısal dönüşümler
    if (updateData.latitude) {
      updateData.latitude = Number(updateData.latitude);
    }
    if (updateData.longitude) {
      updateData.longitude = Number(updateData.longitude);
    }

    // Mongoose validasyonları güncellemede de çalışsın
    const updatedCityImage = await CityImage.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('country', 'name')
      .populate('city', 'name')
      .populate('category', 'name')
      .populate('features');

    if (!updatedCityImage) {
      return res.status(404).json({ message: 'Kent İmgesi bulunamadı!' });
    }

    return res.status(200).json({
      message: 'Kent İmgesi başarıyla güncellendi!',
      updatedCityImage,
    });
  } catch (error) {
    // Mongoose Validation Error
    if (error.name === 'ValidationError') {
      const errors = {};
      for (const field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({
        message: 'Validation Error',
        errors,
      });
    }

    console.error('Hata:', error);
    return res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Kent İmgesini Sil
exports.deleteCityImage = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCityImage = await CityImage.findByIdAndDelete(id);
    if (!deletedCityImage) {
      return res.status(404).json({ message: 'Kent İmgesi bulunamadı!' });
    }

    return res.status(200).json({
      message: 'Kent İmgesi başarıyla silindi!',
      deletedCityImage,
    });
  } catch (error) {
    console.error('Hata:', error);
    return res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Toplam Kent İmgesi Sayısı
exports.getCityImageCount = async (req, res) => {
  try {
    const count = await CityImage.countDocuments();
    return res.status(200).json({ count });
  } catch (error) {
    console.error('Hata:', error);
    return res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};
