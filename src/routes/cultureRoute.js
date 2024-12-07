// routes/cultureRoute.js
const express = require('express');
const router = express.Router();
const CultureRoute = require('../models/cultureRoute');
const CityImage = require('../models/cityImage');

// Yeni kültür rotası oluşturma
router.post('/olustur', async (req, res) => {
  try {
    const { routeName, description, cityImageIds, userId } = req.body;

    if (cityImageIds.length > 10) {
      return res.status(400).json({ error: 'En fazla 10 kent imgesi seçilebilir.' });
    }

    // Yeni kültür rotası oluşturma
    const newCultureRoute = new CultureRoute({
      routeName,
      description,
      cityImages: cityImageIds,
      createdBy: userId, // Kullanıcı kimliğini burada saklıyoruz
    });

    await newCultureRoute.save();
    res.status(201).json({ message: 'Kültür rotası başarıyla oluşturuldu.', newCultureRoute });
  } catch (error) {
    res.status(500).json({ error: 'Kültür rotası oluşturulurken bir hata oluştu.' });
  }
});

// Kültür rotası detaylarını ve Google Maps rotasını alma
router.get('/:id', async (req, res) => {
  try {
    const cultureRoute = await CultureRoute.findById(req.params.id).populate('cityImages');

    if (!cultureRoute) {
      return res.status(404).json({ error: 'Kültür rotası bulunamadı.' });
    }

    // Google Maps rotası oluşturma
    const waypoints = cultureRoute.cityImages
      .map((cityImage) => cityImage.address.mapUrl)
      .filter((mapUrl) => mapUrl); // mapUrl boş değilse kullan

    if (waypoints.length < 2) {
      return res.status(400).json({ error: 'Google Maps rotası oluşturmak için en az 2 nokta gereklidir.' });
    }

    const googleMapsBaseUrl = 'https://www.google.com/maps/dir/?api=1&travelmode=driving';
    const googleMapsUrl = waypoints.reduce((acc, current, index) => {
      if (index === 0) {
        return `${acc}&origin=${encodeURIComponent(current)}`;
      } else if (index === waypoints.length - 1) {
        return `${acc}&destination=${encodeURIComponent(current)}`;
      } else {
        return `${acc}&waypoints=${encodeURIComponent(current)}`;
      }
    }, googleMapsBaseUrl);

    res.status(200).json({ cultureRoute, googleMapsUrl });
  } catch (error) {
    res.status(500).json({ error: 'Kültür rotası detayları alınırken bir hata oluştu.' });
  }
});

module.exports = router;
