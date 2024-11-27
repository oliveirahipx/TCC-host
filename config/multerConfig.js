const multer = require('multer');
const path = require('path');
const uploadDirectory = path.join(__dirname, '../public/uploads');
// Configuração do multer para o upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nome único para a imagem
    }
});

const upload = multer({ storage: storage });

module.exports = upload;  // Exporta o middleware 'upload'
