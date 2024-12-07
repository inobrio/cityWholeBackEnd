const express = require('express');
const router = express.Router();
const Rota = require('../models/rota');

// Rota oluşturma
router.post('/olustur', async (req, res) => {
  try {
    const { rotaAdi, aciklama, baslangicNoktasi, bitisNoktasi, araNoktalar } = req.body;

    // Yeni rota oluşturma
    const yeniRota = new Rota({
      rotaAdi,
      aciklama,
      baslangicNoktasi,
      bitisNoktasi,
      araNoktalar
    });

    await yeniRota.save();
    res.status(201).json({ message: 'Rota oluşturuldu, admin onayı bekleniyor.' });
  } catch (error) {
    res.status(500).json({ error: 'Rota oluşturulurken bir hata oluştu.' });
  }
});

// 3. **Admin Onayı için Endpoint Ekleyin**: Adminin rotaları onaylayabileceği bir endpoint oluşturun. Bu endpoint, rota ID'si alacak ve ilgili rotanın onay durumunu güncelleyecek.

// Onay bekleyen rotaları listeleme
router.get('/onay-bekleyen', async (req, res) => {
    try {
      const bekleyenRotalar = await Rota.find({ onayDurumu: false });
      res.status(200).json(bekleyenRotalar);
    } catch (error) {
      res.status(500).json({ error: 'Rotalar alınırken bir hata oluştu.' });
    }
  });

  router.put('/puan-ver/:id', async (req, res) => {
    try {
      const rotaId = req.params.id;
      const { rating } = req.body;
  
      const rota = await Rota.findById(rotaId);
      if (!rota) {
        return res.status(404).json({ error: 'Rota bulunamadı.' });
      }
  
      // Yeni puanı ekleyip ortalamayı hesaplayın
      rota.ratings.push(rating);
      rota.averageRating = rota.ratings.reduce((acc, val) => acc + val, 0) / rota.ratings.length;
  
      await rota.save();
      res.status(200).json({ message: 'Puan başarıyla kaydedildi.' });
    } catch (error) {
      res.status(500).json({ error: 'Puanlama sırasında bir hata oluştu.' });
    }
  });
  
// Rota onayı (admin tarafından)
router.put('/onayla/:id', async (req, res) => {
  try {
    const rotaId = req.params.id;
    const rota = await Rota.findById(rotaId);

    if (!rota) {
      return res.status(404).json({ error: 'Rota bulunamadı.' });
    }

    rota.onayDurumu = true;
    await rota.save();

    res.status(200).json({ message: 'Rota onaylandı.' });
  } catch (error) {
    res.status(500).json({ error: 'Rota onaylanırken bir hata oluştu.' });
  }
});

// 4. **Onaylanmış Rotaları Listeleme**: Mobil uygulama tarafından erişilebilecek onaylanmış rotaları dönen bir endpoint oluşturun.

// Onaylanmış rotaları listeleme
router.get('/onaylanmis', async (req, res) => {
  try {
    const onaylanmisRotalar = await Rota.find({ onayDurumu: true });
    res.status(200).json(onaylanmisRotalar);
  } catch (error) {
    res.status(500).json({ error: 'Rotalar listelenirken bir hata oluştu.' });
  }
});

module.exports = router;