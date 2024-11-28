const app = require('./config/server');
const pool = require('./config/db');  // Importando corretamente o db.js de config

const rotaNotas = require('./app/routes/notas');
rotaNotas(app, pool);

const rotaPerfil = require('./app/routes/perfil');
rotaPerfil(app, pool);

const rotaAdministrar = require('./app/routes/adm');
rotaAdministrar(app, pool);

const rotaIndex = require('./app/routes/');
rotaIndex(app, pool);

const rotaCadastro = require('./app/routes/Cadastro');
rotaCadastro(app, pool);

const rotaLogin = require('./app/routes/Login');
rotaLogin(app, pool);

app.listen(3001, function() {
    console.log("Server ON");
});
