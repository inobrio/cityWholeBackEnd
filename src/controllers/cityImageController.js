const CityImage = require('../models/cityImage');
const Country = require('../models/country');
const City = require('../models/city');
const Category = require('../models/category');
const Attribute = require('../models/attribute'); // Özelliklerin referansı için

// Kent İmgesi Ekle
exports.addCityImage = async (req, res) => {
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
  } = req.body;

  try {
    // Ülke, şehir ve kategori varlığını kontrol et
    const existingCountry = await Country.findById(country);
    const existingCity = await City.findById(city);
    const existingCategory = await Category.findById(category);

    if (!existingCountry) return res.status(400).json({ message: 'Geçerli bir ülke seçmelisiniz!' });
    if (!existingCity) return res.status(400).json({ message: 'Geçerli bir şehir seçmelisiniz!' });
    if (!existingCategory) return res.status(400).json({ message: 'Geçerli bir kategori seçmelisiniz!' });

    // Kapak resmi ve galeri görselleri kontrolü
    const coverImage = req.files.coverImage?.[0]?.path;
    const galleryImages = req.files.galleryImages?.map((file) => file.path) || [];

    if (!coverImage) return res.status(400).json({ message: 'Kapak resmi yüklenmesi gerekiyor!' });
    if (galleryImages.length > 6) return res.status(400).json({ message: 'Maksimum 6 galeri görseli yüklenebilir!' });

    const cityImage = new CityImage({
      country,
      city,
      category,
      title,
      description,
      address: JSON.parse(address), // Adresi JSON formatında işlemek için
      fee,
      editorNotes,
      events,
      features, // Özelliklerin ID'leri
      contact: JSON.parse(contact), // İletişim bilgilerini JSON formatında işlemek için
      coverImage,
      galleryImages,
    });

    await cityImage.save();
    res.status(201).json({ message: 'Kent İmgesi başarıyla eklendi!', cityImage });
  } catch (error) {
    console.error('Hata:', error);
    res.status(500).json({ message: 'Bir hata oluştu', error });
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
    res.status(200).json(cityImages);
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Belirli Bir Kent İmgesini Getir
exports.getCityImageById = async (req, res) => {
  const { id } = req.params;

  try {
    const cityImage = await CityImage.findById(id)
      .populate('country', 'name') // Ülke adı
      .populate('city', 'name') // Şehir adı
      .populate('category', 'name') // Kategori adı
      .populate('features'); // Özellik detayları

    if (!cityImage) return res.status(404).json({ message: 'Kent İmgesi bulunamadı!' });

    res.status(200).json(cityImage);
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Kent İmgesini Güncelle
exports.updateCityImage = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Güncelleme sırasında coverImage ve galleryImages'i dosyalardan al
    if (req.files.coverImage) {
      updateData.coverImage = req.files.coverImage[0].path;
    }
    if (req.files.galleryImages) {
      updateData.galleryImages = req.files.galleryImages.map((file) => file.path);
    }

    const updatedCityImage = await CityImage.findByIdAndUpdate(id, updateData, { new: true })
      .populate('country', 'name') // Ülke adı
      .populate('city', 'name') // Şehir adı
      .populate('category', 'name') // Kategori adı
      .populate('features'); // Özellik detayları

    if (!updatedCityImage) return res.status(404).json({ message: 'Kent İmgesi bulunamadı!' });

    res.status(200).json({ message: 'Kent İmgesi başarıyla güncellendi!', updatedCityImage });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Kent İmgesini Sil
exports.deleteCityImage = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCityImage = await CityImage.findByIdAndDelete(id);
    if (!deletedCityImage) return res.status(404).json({ message: 'Kent İmgesi bulunamadı!' });

    res.status(200).json({ message: 'Kent İmgesi başarıyla silindi!', deletedCityImage });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};
