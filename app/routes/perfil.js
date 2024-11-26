const multer = require('multer');
const path = require('path');

// Configuração do multer para o upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Pasta onde as imagens serão armazenadas
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nome único para a imagem
    }
});
const upload = multer({ storage: storage });

module.exports = function(app, pool) {
    // Middleware para verificar autenticação
    function isAuthenticated(req, res, next) {
        if (req.session) {
            return next(); // Se o usuário estiver logado, continua
        } else {
            res.redirect('/login'); // Se não estiver logado, redireciona para a página de login
        }
    }

    // Rota para a página de perfil (verifica se o usuário está logado)
    app.get('/perfil', isAuthenticated, function(req, res) {
        const usuarioId = req.session.usuarioId; // Recupera o ID do usuário da sessão
        console.log(req.session);  // Adicione esse log para verificar a sessão

        pool.query('SELECT * FROM usuarios WHERE id = $1', [usuarioId], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Erro ao buscar dados do usuário');
            } else {
                const usuario = result.rows[0]; // A primeira linha do resultado será o usuário
                res.render('perfil', { usuario }); // Envia os dados do usuário para a página
            }
        });
    });

    // Rota para upload de imagem de perfil
    app.post('/upload', isAuthenticated, upload.single('imagemPerfil'), (req, res) => {
        const usuarioId = req.session.usuarioId;
        const imagemPerfil = req.file.filename; // O nome do arquivo da imagem

        // Atualiza a imagem de perfil no banco de dados
        pool.query('UPDATE usuarios SET imagemPerfil = $1 WHERE id = $2', [imagemPerfil, usuarioId], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Erro ao atualizar a imagem de perfil');
            } else {
                res.redirect('/perfil'); // Redireciona de volta para a página de perfil
            }
        });
    });
};
