const mongoose = require('mongoose');
const Category = require('../models/category'); // Model yolunuza göre düzenleyin
require('dotenv').config();

const categoriesData = [
  { name: "Tarihi Alanlar", description: "Tarihi değeri olan alanlar ve yapılar." },
  { name: "Doğal Oluşumlar", description: "Doğa tarafından oluşmuş alanlar." },
  { name: "Kültür Varlıkları", description: "Kültürel ve sanatsal değeri olan yapılar." },
  { name: "Ören Yerleri", description: "Tarihi antik yerleşim alanları." },
  { name: "Plajlar", description: "Yüzme, güneşlenme gibi aktiviteler için alanlar." },
  { name: "Kütüphaneler", description: "Bilgiye erişim için yerel ve ulusal kütüphaneler." },
  { name: "Mesire Alanları", description: "Doğa ile iç içe piknik ve etkinlik alanları." },
  { name: "Etkinlik Alanları", description: "Konser, festival gibi etkinliklerin düzenlendiği alanlar." }
];

async function addCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const existingCategories = await Category.find();
    if (existingCategories.length > 0) {
      console.log("Kategoriler zaten eklenmiş!");
    } else {
      await Category.insertMany(categoriesData);
      console.log("Kategoriler başarıyla eklendi!");
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("Bir hata oluştu:", error);
    mongoose.connection.close();
  }
}

addCategories();
