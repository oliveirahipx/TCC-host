var express = require('express');
var app = express();

// Configurações do Express
app.set('view engine', 'ejs'); 
app.set('views', './app/views');
app.set('public', './public'); 

// Outras configurações e rotas podem ser adicionadas aqui

module.exports = app; // Isso deve vir depois da definição do app
