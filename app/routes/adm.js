const bcrypt = require('bcryptjs');
const { upload, cloudinary } = require('../../config/multerConfig');

module.exports = function (app, pool) {
    // Middleware para verificar autenticação
    function isAuthenticated(req, res, next) {
        if (req.session && req.session.user) {
            return next();
        } else {
            res.redirect('/login');
        }
    }

    // Rota para a página inicial da administração
    app.get('/Administrar', isAuthenticated, async (req, res) => {
        try {
            // Verifica se o usuário está logado e carrega informações de perfil
            const usuarioId = req.session.user?.id;
    
            if (!usuarioId) {
                return res.redirect('/login');
            }
    
            // Busca o usuário logado
            const { rows: usuarioRows } = await pool.query('SELECT * FROM Usuarios WHERE id = $1', [usuarioId]);
            const usuario = usuarioRows[0];
            if (!usuario) {
                return res.status(404).send('Usuário não encontrado');
            }
    
            // Define imagem de perfil padrão, caso não tenha
            usuario.imagemPerfil = usuario.imagemperfil || 
                'https://res.cloudinary.com/duslicdkg/image/upload/v1732682709/user_images/hvgfrnagncizszy4lu83.jpg';
    
            // Busca todos os usuários para a tabela
            const { rows: users } = await pool.query('SELECT * FROM Usuarios');
    
            // Busca os professores e suas matérias
            const professores = users.filter((user) => user.cargo === 'professor');
            const professoresComMaterias = await Promise.all(
                professores.map(async (professor) => {
                    const { rows: materias } = await pool.query(
                        `SELECT m.nome AS materia 
                         FROM Professores_Materias pm 
                         JOIN Materias m ON m.id = pm.id_materia 
                         WHERE pm.id_professor = $1`,
                        [professor.id]
                    );
                    return { ...professor, materias };
                })
            );
    
            // Renderiza a página de administração
            res.render('adm', {
                session: req.session,
                usuario,
                users,
                professoresComMaterias,
            });
        } catch (err) {
            console.error('Erro ao carregar a página de administração:', err.message);
            res.status(500).send('Erro ao carregar a página de administração');
        }
    });
    
    // Rota para editar um usuário
    app.get('/adm/editar/:id', isAuthenticated, async (req, res) => {
        const { id } = req.params;

        try {
            const { rows: userResult } = await pool.query('SELECT * FROM Usuarios WHERE id = $1', [id]);
            if (userResult.length === 0) {
                return res.status(404).send('Usuário não encontrado');
            }
            const user = userResult[0];

            const { rows: materias } = await pool.query('SELECT * FROM Materias');

            const { rows: materiasAssociadas } = await pool.query(
                `SELECT m.id AS materiaId 
                 FROM Professores_Materias pm 
                 JOIN Materias m ON m.id = pm.id_materia 
                 WHERE pm.id_professor = $1`,
                [id]
            );

            const materiasIdsAssociadas = materiasAssociadas.map((item) => item.materiaid);

            res.render('editar', {
                user,
                materias,
                materiasAssociadas: materiasIdsAssociadas,
                session: req.session,
            });
        } catch (err) {
            console.error('Erro ao carregar a página de edição:', err.message);
            res.status(500).send('Erro ao carregar a página de edição');
        }
    });

    // Rota para salvar edições de um usuário
    app.post('/adm/edit/:id', isAuthenticated, async (req, res) => {
        const { id } = req.params;
        const { nome, email, cargo, materias } = req.body;

        if (!nome || !email || !cargo) {
            return res.status(400).send('Todos os campos obrigatórios devem ser preenchidos.');
        }

        try {
            await pool.query(
                'UPDATE Usuarios SET nome = $1, email = $2, cargo = $3 WHERE id = $4',
                [nome, email, cargo, id]
            );

            if (cargo === 'professor' && materias) {
                await pool.query('DELETE FROM Professores_Materias WHERE id_professor = $1', [id]);

                if (Array.isArray(materias)) {
                    for (const materiaId of materias) {
                        await pool.query(
                            'INSERT INTO Professores_Materias (id_professor, id_materia) VALUES ($1, $2)',
                            [id, materiaId]
                        );
                    }
                }
            }

            console.log('Usuário atualizado com sucesso');
            res.redirect('/Administrar');
        } catch (err) {
            console.error('Erro ao atualizar o usuário:', err.message);
            res.status(500).send('Erro ao atualizar o usuário');
        }
    });

    // Rota para cadastrar um novo usuário
    app.post('/admin/addUser', async (req, res) => {
        const { nome, data_nascimento, email, senha, cargo } = req.body;

        if (!nome || !email || !senha || !cargo) {
            return res.status(400).send('Todos os campos são obrigatórios');
        }

        try {
            const hashedPassword = await bcrypt.hash(senha, 10);

            await pool.query(
                'INSERT INTO Usuarios (nome, data_nascimento, email, senha, cargo) VALUES ($1, $2, $3, $4, $5)',
                [nome, data_nascimento, email, hashedPassword, cargo]
            );

            console.log('Usuário cadastrado com sucesso');
            res.redirect('/Administrar');
        } catch (err) {
            console.error('Erro ao cadastrar o usuário:', err.message);
            res.status(500).send('Erro ao cadastrar o usuário');
        }
    });

    // Rota para excluir um usuário
    app.post('/admin/deleteUser/:id', isAuthenticated, async (req, res) => {
        const { id } = req.params;

        try {
            await pool.query('DELETE FROM Usuarios WHERE id = $1', [id]);
            console.log('Usuário excluído com sucesso');
            res.redirect('/Administrar');
        } catch (err) {
            console.error('Erro ao excluir o usuário:', err.message);
            res.status(500).send('Erro ao excluir o usuário');
        }
    });

    // Rota para upload de imagem de perfil
    app.post('/admin/upload/:id', isAuthenticated, upload.single('imagemPerfil'), (req, res) => {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).send('Nenhuma imagem foi enviada');
        }

        cloudinary.uploader.upload_stream({ folder: 'user_images' }, async (error, result) => {
            if (error) {
                console.error('Erro ao fazer upload da imagem para o Cloudinary:', error);
                return res.status(500).send('Erro ao fazer upload da imagem para o Cloudinary');
            }

            const imagemPerfil = result.secure_url;

            try {
                await pool.query('UPDATE Usuarios SET imagemPerfil = $1 WHERE id = $2', [imagemPerfil, id]);
                console.log('Imagem de perfil atualizada com sucesso');
                res.redirect('/adm/editar/' + id);
            } catch (err) {
                console.error('Erro ao atualizar a imagem de perfil no banco:', err.message);
                res.status(500).send('Erro ao atualizar a imagem de perfil');
            }
        }).end(req.file.buffer);
    });
};
