const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configuração do Cloudinary com suas credenciais
cloudinary.config({
  cloud_name: 'duslicdkg',
  api_key: '638174877423351',
  api_secret: 'CwOBKADfl0mtRv26B2n5WE7X5Qs',
});

// Configuração do Multer para usar memoryStorage, já que a imagem vai para o Cloudinary
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

module.exports = { upload, cloudinary };
