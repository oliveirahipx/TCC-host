const mysql = require('mysql2');
const bcrypt = require('bcryptjs');


module.exports = function(app) {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'm084880',
        database: 'Escola',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    try {
        pool.query('SELECT * FROM Usuarios', (err, results) => {
            if (err) {
                console.error('Erro ao consultar o banco de dados: ', err.message);
                return res.status(500).send('Erro ao consultar o banco de dados');
            }

        
            console.log(results);

        });
    } catch (error) {
        console.error('Erro no aplicativo: ', error);
        res.status(500).send('Erro interno do servidor');
    }

    // Rota para exibir a página de login
    app.get('/login', function(req, res) {
        res.render('Login');
    });

    // Rota para logar o usuário
    app.post('/Logar', function(req, res) {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).send('Todos os campos são obrigatórios');
        }

        // Consulta para verificar o email e senha no banco de dados
        pool.query('SELECT * FROM Usuarios WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error('Erro ao consultar o banco de dados:', err.message);
                return res.status(500).send('Erro ao consultar o banco de dados');
            }

            const user = results[0];
            if (!user) {
                return res.send("Usuário ou senha incorretos.");
            }


            const isPasswordValid = await (senha, user.senha);
            if (isPasswordValid) {
                req.session.user = user; // Salva o usuário na sessão 
                console.log('Login Efetuado');
                return res.redirect('/index');
            } else {
                res.send("Usuário ou senha incorretos.");
            }
        });
    });

    

    // Rota para exibir a página principal com a sessão
    app.get('/index', function(req, res) {
        res.render('index', { session: req.session });
    });

    // Rota para logout
    app.get('/logout', function(req, res) {
        req.session.destroy(() => {
            res.redirect('/index'); // Redireciona para a página inicial
        });
    });
};
