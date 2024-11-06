module.exports = function(app) {

    app.get('/Cadastro', function(req, res) {
        res.render('secao/Cadastro.ejs'); 
    });


};
