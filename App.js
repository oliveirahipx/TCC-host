var app = require('./config/server')

var rotaIndex = require('./app/routes/index')
rotaIndex(app);
var rotaCadastro = require('./app/routes/Cadastro_alunos')
rotaCadastro(app);
var rotaCadastro_professor = require('./app/routes/Cadastro_professor')
rotaCadastro_professor(app);




app.listen(3000,function(){
    console.log("Server ON")
});