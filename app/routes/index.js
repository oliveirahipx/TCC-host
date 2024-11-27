const { upload, cloudinary } = require('../../config/multerConfig');

module.exports = function(app, pool) {
    // Middleware para verificar autenticação
    function isAuthenticated(req, res, next) {
        if (req.session && req.session.user && req.session.user.id) {
            return next();
        } else {
            res.redirect('/login');
        }
    }

    // Rota para a página inicial
    app.get('/', function(req, res) {
        if (req.session && req.session.user && req.session.user.id) {
            const usuarioId = req.session.user.id;

            pool.query('SELECT * FROM usuarios WHERE id = $1', [usuarioId], (err, result) => {
                if (err) {
                    console.error('Erro ao buscar dados do usuário:', err);
                    return res.status(500).send('Erro ao buscar dados do usuário');
                }

                if (result.rows.length === 0) {
                    console.error('Usuário não encontrado');
                    return res.status(404).send('Usuário não encontrado');
                }

                const usuario = result.rows[0];

                // Atualizando `usuario.imagemPerfil` com o valor do banco
                const imagemPerfilBanco = usuario.imagemperfil;
                usuario.imagemPerfil = imagemPerfilBanco 
                    ? imagemPerfilBanco 
                    : 'https://res.cloudinary.com/duslicdkg/image/upload/v1732682709/user_images/hvgfrnagncizszy4lu83.jpg';

                console.log('URL da imagem de perfil carregada do banco:', usuario.imagemPerfil);

                // Renderiza a página index com a sessão e os dados do usuário
                res.render('index', { 
                    session: req.session,
                    usuario 
                });
            });
        } else {
            // Renderiza a página sem informações adicionais caso o usuário não esteja logado
            res.render('index', { session: req.session });
        }
    });

    // Middleware para autenticação em outras rotas
    app.get('/perfil', isAuthenticated, function(req, res) {
        const usuarioId = req.session.user.id;

        pool.query('SELECT * FROM usuarios WHERE id = $1', [usuarioId], (err, result) => {
            if (err) {
                console.error('Erro ao buscar dados do usuário:', err);
                return res.status(500).send('Erro ao buscar dados do usuário');
            }

            if (result.rows.length === 0) {
                console.error('Usuário não encontrado');
                return res.status(404).send('Usuário não encontrado');
            }

            const usuario = result.rows[0];
            const imagemPerfilBanco = usuario.imagemperfil;
            usuario.imagemPerfil = imagemPerfilBanco 
                ? imagemPerfilBanco 
                : 'https://res.cloudinary.com/duslicdkg/image/upload/v1732682709/user_images/hvgfrnagncizszy4lu83.jpg';

            res.render('perfil', { 
                usuario, 
                session: req.session 
            });
        });
    });

    // Rota para upload de imagem de perfil
    app.post('/upload', isAuthenticated, upload.single('imagemPerfil'), (req, res) => {
        const usuarioId = req.session.user.id;

        if (!req.file) {
            return res.status(400).send('Nenhuma imagem foi enviada');
        }

        cloudinary.uploader.upload_stream({ folder: 'user_images' }, (error, result) => {
            if (error) {
                console.error('Erro ao fazer upload da imagem para o Cloudinary:', error);
                return res.status(500).send('Erro ao fazer upload da imagem para o Cloudinary');
            }

            const imagemPerfil = result.secure_url;

            pool.query('UPDATE usuarios SET imagemPerfil = $1 WHERE id = $2', [imagemPerfil, usuarioId], (err) => {
                if (err) {
                    console.error('Erro ao atualizar a imagem de perfil:', err);
                    return res.status(500).send('Erro ao atualizar a imagem de perfil');
                }

                req.session.user.imagemPerfil = imagemPerfil;

                res.redirect('/perfil');
            });
        }).end(req.file.buffer);
    });
};
