var app = require('./config/server')

var rotaIndex = require('./app/routes/index')
rotaIndex(app);
var rotaCadastro = require('./app/routes/Cadastro')
rotaCadastro(app);
var rotaLogin = require('./app/routes/Login')
rotaLogin(app);




app.listen(3000,function(){
    console.log("Server ON")
});