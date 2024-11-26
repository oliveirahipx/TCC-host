const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const pool = require('./db');  // Importando corretamente o db.js de config
const perfilRoutes = require("./routes/perfil");


app.set('view engine', 'ejs');
app.set('views', './app/views');
app.set('public', './public');
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "uploads")));


app.use(session({
  secret: 'seu-segredo-aqui',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

module.exports = app;
