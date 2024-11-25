const City = require('../models/city');
const Country = require('../models/country');

// Tüm Şehirleri Listele
exports.getCities = async (req, res) => {
  try {
    const cities = await City.find().populate('country', 'name'); // Ülke bilgisiyle birlikte getir
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Belirli Bir Ülkenin Şehirlerini Listele
exports.getCitiesByCountry = async (req, res) => {
  const { countryId } = req.params;

  try {
    const cities = await City.find({ country: countryId }).populate('country', 'name');
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Yeni Şehir Ekle
exports.addCity = async (req, res) => {
  const { name, countryId } = req.body;

  try {
    const country = await Country.findById(countryId);
    if (!country) return res.status(400).json({ message: 'Geçerli bir ülke bulunamadı!' });

    const city = new City({ name, country: country._id });
    await city.save();
    res.status(201).json({ message: 'Şehir başarıyla eklendi!', city });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Şehri Güncelle
exports.updateCity = async (req, res) => {
  const { id } = req.params;
  const { name, countryId } = req.body;

  try {
    const updatedCity = await City.findByIdAndUpdate(
      id,
      { name, country: countryId },
      { new: true }
    ).populate('country', 'name');
    if (!updatedCity) return res.status(404).json({ message: 'Şehir bulunamadı!' });

    res.status(200).json({ message: 'Şehir başarıyla güncellendi!', updatedCity });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Şehri Sil
exports.deleteCity = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCity = await City.findByIdAndDelete(id);
    if (!deletedCity) return res.status(404).json({ message: 'Şehir bulunamadı!' });

    res.status(200).json({ message: 'Şehir başarıyla silindi!', deletedCity });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};
