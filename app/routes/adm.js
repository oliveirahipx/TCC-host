const bcrypt = require('bcryptjs');

module.exports = function (app, pool) {
    // Middleware para verificar autenticação
    function isAuthenticated(req, res, next) {
        if (req.session && req.session.user) {
            return next();
        } else {
            res.redirect('/login');
        }
    }

    // Rota para a página de administração
    app.get('/Administrar', isAuthenticated, async (req, res) => {
        try {
            // Busca todos os usuários
            const { rows: users } = await pool.query('SELECT * FROM Usuarios');

            // Filtra os professores e busca suas matérias
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
            // Busca o usuário pelo ID
            const { rows: userResult } = await pool.query('SELECT * FROM Usuarios WHERE id = $1', [id]);
            if (userResult.length === 0) {
                return res.status(404).send('Usuário não encontrado');
            }
            const user = userResult[0];

            // Busca todas as matérias disponíveis
            const { rows: materias } = await pool.query('SELECT * FROM Materias');

            // Busca as matérias associadas ao professor
            const { rows: materiasAssociadas } = await pool.query(
                `SELECT m.id AS materiaId 
                 FROM Professores_Materias pm 
                 JOIN Materias m ON m.id = pm.id_materia 
                 WHERE pm.id_professor = $1`,
                [id]
            );

            const materiasIdsAssociadas = materiasAssociadas.map((item) => item.materiaid);

            // Renderiza a página de edição
            res.render('editar', {
                user,
                materias,
                materiasAssociadas: materiasIdsAssociadas,
            });
        } catch (err) {
            console.error('Erro ao carregar a página de edição:', err.message);
            res.status(500).send('Erro ao carregar a página de edição');
        }
    });

    // Rota para salvar as edições de um usuário
    app.post('/adm/edit/:id', isAuthenticated, async (req, res) => {
        const { id } = req.params;
        const { nome, email, cargo, materias } = req.body;

        if (!nome || !email || !cargo) {
            return res.status(400).send('Todos os campos obrigatórios devem ser preenchidos.');
        }

        try {
            // Atualiza os dados do usuário
            await pool.query(
                'UPDATE Usuarios SET nome = $1, email = $2, cargo = $3 WHERE id = $4',
                [nome, email, cargo, id]
            );

            if (cargo === 'professor' && materias) {
                // Remove as associações de matérias existentes
                await pool.query('DELETE FROM Professores_Materias WHERE id_professor = $1', [id]);

                // Insere as novas associações
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
            // Criptografa a senha antes de armazenar
            const hashedPassword = await bcrypt.hash(senha, 10);

            // Insere o novo usuário
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
};
