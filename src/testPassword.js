const bcrypt = require('bcrypt');

async function testPassword() {
  const plainPassword = '123'; // Girilen şifre
  const hashedPassword = '$2b$10$WzJD5SWz5wkjXhh7Sh0B..D3039tVQH0kwozmucaNjiEkxlC7KE/u'; // Veritabanındaki hash

  const isValid = await bcrypt.compare(plainPassword, hashedPassword);
  console.log('Şifre doğrulandı mı?:', isValid);
}

testPassword();
