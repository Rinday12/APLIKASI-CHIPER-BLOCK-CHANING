const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const crypto = require('crypto');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Menangani permintaan POST dari formulir enkripsi
app.post('/encrypt', (req, res) => {
  const key = req.body.key;
  const plaintext = req.body.plaintext;

  // Menghasilkan vektor inisialisasi acak
  const iv = crypto.randomBytes(16);

  // Mengenkripsi plaintext menggunakan algoritma CBC
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
  ciphertext += cipher.final('hex');

  res.send({ ciphertext, iv });
});

// Menangani permintaan POST dari formulir dekripsi
app.post('/decrypt', (req, res) => {
  const key = req.body.key;
  const ciphertext = req.body.ciphertext;
  const iv = req.body.iv;

  // Mendekripsi ciphertext menggunakan algoritma CBC
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
  plaintext += decipher.final('utf8');

  res.send({ plaintext });
});

app.listen(4000, () => {
  console.log('Server berjalan di http://localhost:4000');
});
