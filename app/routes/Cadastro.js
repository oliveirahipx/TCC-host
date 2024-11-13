const mysql = require('mysql2'); // Usando mysql2

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

    // Rota para exibir a página de cadastro de aluno
    app.get('/Cadastro', function(req, res) {
        try {
            pool.query('SELECT * FROM Usuarios', (err, results) => {
                if (err) {
                    console.error('Erro ao consultar o banco de dados: ', err.message);
                    return res.status(500).send('Erro ao consultar o banco de dados');
                }

                // Log para verificar os resultados da consulta
                console.log(results);

                // Renderizando a página EJS com os dados obtidos
                res.render('Cadastro.ejs', { Alunos: results });
            });
        } catch (error) {
            console.error('Erro no aplicativo: ', error);
            res.status(500).send('Erro interno do servidor');
        }
    });

    // Rota para cadastrar um novo aluno
    app.post('/cadastrar', function(req, res) {
        const { nome, data_nascimento, email, senha, cargo } = req.body;

        // Verificando se todos os dados foram fornecidos
        if (!nome || !data_nascimento || !email || !senha) {
            return res.status(400).send('Todos os campos são obrigatórios');
        }

        // Inserindo os dados do aluno na tabela "Alunos"
        const query = 'INSERT INTO Usuarios (nome, data_nascimento, email, senha) VALUES (?, ?, ?, ?)';
        pool.query(query, [nome, data_nascimento, email, senha], (err, results) => {
            if (err) {
                console.error('Erro ao cadastrar: ', err.message);
                return res.status(500).send('Erro ao cadastrar');
            }

            console.log('Cadastro Feito com sucesso');
            res.redirect('/login'); 
        });
    });
}
