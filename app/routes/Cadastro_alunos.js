const mysql = require('mysql2'); // Usando mysql2

module.exports = function(app) {
    // Criando o pool de conexões (melhor do que criar uma conexão direta)
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'm084880',
        database: 'Escola',
        waitForConnections: true,
        connectionLimit: 10,  // Limite de conexões simultâneas
        queueLimit: 0
    });

    // Rota para exibir a página de cadastro de aluno
    app.get('/Cadastro_alunos', function(req, res) {
        try {
            pool.query('SELECT * FROM Alunos', (err, results) => {
                if (err) {
                    console.error('Erro ao consultar o banco de dados: ', err.message);
                    return res.status(500).send('Erro ao consultar o banco de dados');
                }

                // Log para verificar os resultados da consulta
                console.log(results);

                // Renderizando a página EJS com os dados obtidos
                res.render('Cadastro_alunos.ejs', { Alunos: results });
            });
        } catch (error) {
            console.error('Erro no aplicativo: ', error);
            res.status(500).send('Erro interno do servidor');
        }
    });

    // Rota para cadastrar um novo aluno
    app.post('/cadastrar-aluno', function(req, res) {
        const { nome, data_nascimento, email, senha } = req.body;

        // Verificando se todos os dados foram fornecidos
        if (!nome || !data_nascimento || !email || !senha) {
            return res.status(400).send('Todos os campos são obrigatórios');
        }

        // Inserindo os dados do aluno na tabela "Alunos"
        const query = 'INSERT INTO Alunos (nome, data_nascimento, email, senha) VALUES (?, ?, ?, ?)';
        pool.query(query, [nome, data_nascimento, email, senha], (err, results) => {
            if (err) {
                console.error('Erro ao cadastrar o aluno: ', err.message);
                return res.status(500).send('Erro ao cadastrar o aluno');
            }

            console.log('Aluno cadastrado com sucesso');
            res.redirect('/Login'); // Redireciona para a página de cadastro de alunos
        });
    });

    // Rota para atualizar os dados do aluno (por ID)
    app.post('/atualizar-aluno/:id', function(req, res) {
        const { id } = req.params;
        const { nome, dataNascimento, email, senha } = req.body;

        // Verificando se todos os dados foram fornecidos
        if (!nome || !data_nascimento || !email || !senha) {
            return res.status(400).send('Todos os campos são obrigatórios');
        }

        // Atualizando os dados do aluno na tabela "Alunos"
        const query = 'UPDATE Alunos SET nome = ?, dataNascimento = ?, email = ?, senha = ? WHERE id = ?';
        pool.query(query, [nome, data_nascimento, email, senha, id], (err, results) => {
            if (err) {
                console.error('Erro ao atualizar os dados do aluno: ', err.message);
                return res.status(500).send('Erro ao atualizar os dados do aluno');
            }

            console.log('Aluno atualizado com sucesso');
            res.redirect('/Cadastro_alunos'); // Redireciona para a página de cadastro de alunos
        });
    });

    // Fechar o pool de conexões quando o servidor for encerrado
    process.on('exit', () => {
        pool.end();
    });
};
