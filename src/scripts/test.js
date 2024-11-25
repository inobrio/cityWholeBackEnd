const bcrypt = require('bcrypt');

async function testHash() {
  const plainPassword = '123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  console.log('Hashlenmiş Şifre:', hashedPassword);
}

testHash();
