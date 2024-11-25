const mongoose = require('mongoose');
const Attribute = require('../models/attribute'); // Model yolunuza göre düzenleyin
require('dotenv').config();

const attributesData = [
  { name: "WC", description: "Tuvalet alanı mevcut." },
  { name: "Soyunma Kabini", description: "Soyunma kabini bulunmaktadır." },
  { name: "Dj Performansı", description: "Canlı DJ performansı içerir." },
  { name: "Otopark", description: "Araçlar için otopark alanı vardır." },
  { name: "Toplu Taşıma", description: "Toplu taşıma ile kolay erişim sağlanır." },
  { name: "Aileye Uygun", description: "Aileler için uygun bir ortamdır." }
];

async function addAttributes() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const existingAttributes = await Attribute.find();
    if (existingAttributes.length > 0) {
      console.log("Özellikler zaten eklenmiş!");
    } else {
      await Attribute.insertMany(attributesData);
      console.log("Özellikler başarıyla eklendi!");
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("Bir hata oluştu:", error);
    mongoose.connection.close();
  }
}

addAttributes();
