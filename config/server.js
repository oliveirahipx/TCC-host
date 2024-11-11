const express = require('express');
const path = require('path');
const app = express();

// Configurações do Express
app.set('view engine', 'ejs'); 
app.set('views', './app/views');
app.set('public', './public'); 
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true })); 


module.exports = app;