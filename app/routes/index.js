module.exports = function(app) {
app.get('/index', function(req, res) {
    // Passando a sessão como variável para o EJS
    res.render('index', { session: req.session });
});
}
