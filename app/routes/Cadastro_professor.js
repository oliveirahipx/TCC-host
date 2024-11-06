module.exports = function(app) {

    app.get('/Cadastro_professor', function(req, res) {
        res.render('secao/Cadastro_professor.ejs'); 
    });


};
