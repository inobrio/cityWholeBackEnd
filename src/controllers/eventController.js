const Event = require('../models/event');
const City = require('../models/city');
const Attribute = require('../models/attribute'); // Feature yerine Attribute modelini kullanıyoruz

// Etkinlik Ekleme
exports.createEvent = async (req, res) => {
  const { title, description, startDate, endDate, city, category, address, contactInfo, price, attributes } = req.body;

  try {
    const event = new Event({
      title,
      description,
      startDate,
      endDate,
      city,
      category,
      address,
      contactInfo,
      price: price === 0 ? 'Ücretsiz' : price, // 0 ise 'Ücretsiz' olarak kaydet
      attributes
    });

    await event.save();
    res.status(201).json({ message: 'Etkinlik başarıyla oluşturuldu!', event });
  } catch (error) {
    console.error('Etkinlik Ekleme Hatası:', error);
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Tüm Etkinlikleri Listeleme
exports.listEvents = async (req, res) => {
    try {
      const events = await Event.find()
        .populate('city') // Şehir bilgisi için
        .populate('category') // Kategori bilgisi için
        .populate('features'); // Özellikler için
      
      res.status(200).json(events);
    } catch (error) {
      console.error('Etkinlik Listeleme Hatası:', error);
      res.status(500).json({ message: 'Bir hata oluştu', error });
    }
  };

// Etkinlik Güncelleme
exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
  
    try {
      const updatedEvent = await Event.findByIdAndUpdate(id, updatedData, { new: true })
        .populate('city')
        .populate('category')
        .populate('features'); // Düzeltildi
  
      if (!updatedEvent) return res.status(404).json({ message: 'Etkinlik bulunamadı!' });
  
      res.status(200).json({ message: 'Etkinlik başarıyla güncellendi!', updatedEvent });
    } catch (error) {
      console.error('Etkinlik Güncelleme Hatası:', error);
      res.status(500).json({ message: 'Bir hata oluştu', error });
    }
  };
  

// Etkinlik Silme
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) return res.status(404).json({ message: 'Etkinlik bulunamadı!' });

    res.status(200).json({ message: 'Etkinlik başarıyla silindi!', deletedEvent });
  } catch (error) {
    console.error('Etkinlik Silme Hatası:', error);
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};
