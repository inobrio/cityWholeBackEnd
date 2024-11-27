const sendVerificationEmail = require('./utils/sendVerificationEmail');

async function testEmail() {
  try {
    const to = 'aladag102@gmail.com'; // Alıcı adresi
    const subject = 'Test E-postası'; // E-posta konusu
    const htmlContent = '<p>Bu bir <strong>test</strong> e-postasıdır.</p>'; // E-posta içeriği

    await sendVerificationEmail(to, subject, htmlContent);
    console.log('Test e-postası başarıyla gönderildi.');
  } catch (error) {
    console.error('E-posta gönderme hatası:', error);
  }
}

testEmail();
