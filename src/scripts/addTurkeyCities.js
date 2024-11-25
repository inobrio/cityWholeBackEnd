const mongoose = require('mongoose');
const City = require('../models/city'); // Şehir modeli
const Country = require('../models/country'); // Ülke modeli
require('dotenv').config();

const turkeyCities = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya",
  "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt", "Bilecik", "Bingöl",
  "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır",
  "Düzce", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun",
  "Gümüşhane", "Hakkâri", "Hatay", "Iğdır", "Isparta", "İstanbul", "İzmir", "Kahramanmaraş",
  "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kırıkkale", "Kırklareli", "Kırşehir",
  "Kilis", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Mardin", "Mersin", "Muğla",
  "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop",
  "Sivas", "Şanlıurfa", "Şırnak", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Uşak", "Van",
  "Yalova", "Yozgat", "Zonguldak"
];

async function addTurkeyCities() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const country = await Country.findOne({ name: "Türkiye" }); // Türkiye'yi bul
    if (!country) {
      console.log("Türkiye ülkesi bulunamadı. Önce Türkiye'yi ekleyin.");
      mongoose.connection.close();
      return;
    }

    for (const cityName of turkeyCities) {
      const existingCity = await City.findOne({ name: cityName, country: country._id });
      if (!existingCity) {
        const city = new City({ name: cityName, country: country._id });
        await city.save();
        console.log(`Şehir eklendi: ${cityName}`);
      } else {
        console.log(`Şehir zaten mevcut: ${cityName}`);
      }
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("Bir hata oluştu:", error);
    mongoose.connection.close();
  }
}

addTurkeyCities();
