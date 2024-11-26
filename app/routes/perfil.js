module.exports = function(app, pool) {
    app.get('/perfil', function(req, res) {
        // Supondo que o id do usuário esteja na sessão (como exemplo)
        const usuarioId = req.session.usuarioId;

        if (usuarioId) {
            pool.query('SELECT * FROM usuarios WHERE id = $1', [usuarioId], (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Erro ao buscar dados do usuário');
                } else {
                    const usuario = result.rows[0]; // A primeira linha do resultado será o usuário
                    res.render('perfil', { usuario });
                }
            });
        } else {
            res.redirect('/login'); // Redireciona para a página de login se o usuário não estiver logado
        }
    });
};
