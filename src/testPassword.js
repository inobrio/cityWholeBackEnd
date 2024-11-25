const bcrypt = require('bcrypt');

async function testPassword() {
  const plainPassword = '123'; // Şifre
  const hashedPassword = '$2b$10$xDst/5AmwULySAbBS9uXlOkE4yB18kjY9pEiV0AxFXrHslEeaftBe'; // Yeni hash

  const isValid = await bcrypt.compare(plainPassword, hashedPassword);
  console.log('Şifre Doğru Mu?:', isValid);
}

testPassword();
