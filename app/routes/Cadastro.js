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

    // Rota para '/Cadastro'
    app.get('/Cadastro', function(req, res) {
        try {
            // Realizando uma consulta ao banco de dados (tabela Alunos)
            pool.query('SELECT * FROM Alunos', (err, results) => {
                if (err) {
                    console.error('Erro ao consultar o banco de dados: ', err.message);
                    return res.status(500).send('Erro ao consultar o banco de dados');
                }

                // Log para verificar os resultados da consulta
                console.log(results);

                // Renderizando a página EJS com os dados obtidos
                res.render('secao/Cadastro.ejs', { Alunos: results });
            });
        } catch (error) {
            console.error('Erro no aplicativo: ', error);
            res.status(500).send('Erro interno do servidor');
        }
    });

    // Fechar o pool de conexões quando o servidor for encerrado
    process.on('exit', () => {
        pool.end();
    });
};
