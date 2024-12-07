const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();

router.post('/get-instagram-data', async (req, res) => {
  try {
    const { username } = req.body;

    const response = await axios.get(`https://www.instagram.com/${username}/`);
    const html = response.data;
    const $ = cheerio.load(html);

    // Meta tag üzerinden takipçi ve gönderi sayısını alıyoruz
    const scriptTag = $('meta[property="og:description"]').attr('content');
    const [followers, , posts] = scriptTag.match(/\d+[,.\d]*/g).map((num) => num.replace(/[,.]/g, ''));

    res.json({ followers: parseInt(followers, 10), posts: parseInt(posts, 10) });
  } catch (error) {
    console.error('Instagram verisi alınamadı:', error.message);
    res.status(500).json({ error: 'Instagram verisi alınırken bir hata oluştu.' });
  }
});

module.exports = router;
