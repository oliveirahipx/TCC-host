const bcrypt = require('bcryptjs');

module.exports = function (app, pool) {
    // Rota para exibir a página de login
    app.get('/login', (req, res) => {
        res.render('Login');
    });

    // Rota para logar o usuário
    app.post('/Logar', async (req, res) => {
        const { email, senha } = req.body;

        // Verifica se os campos obrigatórios foram fornecidos
        if (!email || !senha) {
            return res.status(400).send('Todos os campos são obrigatórios');
        }

        try {
            // Consulta para buscar o usuário pelo e-mail
            const query = 'SELECT * FROM Usuarios WHERE email = $1';
            const result = await pool.query(query, [email]);

            // Verifica se o usuário existe
            const user = result.rows[0];
            if (!user) {
                return res.status(401).send('Usuário ou senha incorretos.');
            }

            // Verifica se a senha está correta
            const isPasswordValid = await bcrypt.compare(senha, user.senha);
            if (isPasswordValid) {
                // Salva o usuário na sessão
                req.session.user = {
                    id: user.id,
                    nome: user.nome,
                    email: user.email,
                    cargo: user.cargo,
                };
                console.log('Login Efetuado');
                return res.redirect('/index'); // Redireciona após login
            } else {
                return res.status(401).send('Usuário ou senha incorretos.');
            }
        } catch (error) {
            console.error('Erro ao logar o usuário:', error.message);
            return res.status(500).send('Erro interno ao processar o login');
        }
    });

    // Rota para deslogar o usuário
    app.get('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Erro ao finalizar sessão');
            }

            console.log('Logout Efetuado');
            return res.redirect('/login'); // Redireciona para a página de login
        });
    });
};
