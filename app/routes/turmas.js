module.exports = function(app) {
    app.get('/Turmas', function(req, res) {
        res.render('Turmas', { session: req.session });
    });
    }
    