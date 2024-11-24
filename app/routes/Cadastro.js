const bcrypt = require('bcryptjs'); // Para criptografar a senha
const { Pool } = require('pg'); // Importa a biblioteca para PostgreSQL
const pool = require('../../config/db'); // Importa o pool de conexões configurado

module.exports = function (app, pool) {
    // Rota para exibir a página de cadastro de aluno
    app.get('/Cadastro', async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM Usuarios');
            
            // Renderizando a página de cadastro com a lista de alunos
            res.render('Cadastro.ejs', { Alunos: result.rows });
        } catch (error) {
            console.error('Erro ao consultar o banco de dados: ', error.message);
            res.status(500).send('Erro ao consultar o banco de dados');
        }
    });

    // Rota para cadastrar um novo aluno
    app.post('/cadastrar', async (req, res) => {
        const { nome, data_nascimento, email, senha, cargo } = req.body;

        // Verificando se todos os dados obrigatórios foram fornecidos
        if (!nome || !data_nascimento || !email || !senha) {
            return res.status(400).send('Todos os campos são obrigatórios');
        }

        try {
            // Criptografa a senha antes de armazenar
            const hashedPassword = await bcrypt.hash(senha, 10);

            // Consulta de inserção de dados
            const query = `
                INSERT INTO Usuarios (nome, data_nascimento, email, senha, cargo) 
                VALUES ($1, $2, $3, $4, $5) RETURNING *;
            `;
            const values = [nome, data_nascimento, email, hashedPassword, cargo];

            const result = await pool.query(query, values);

            console.log('Cadastro feito com sucesso:', result.rows[0]);
            res.redirect('/login'); // Redireciona para a página de login após o cadastro
        } catch (error) {
            console.error('Erro ao cadastrar:', error.message);
            res.status(500).send('Erro interno ao processar o cadastro');
        }
    });
};
