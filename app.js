const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/config');

const url = config.bd_string;
const options = { reconnectTries: Number.MAX_VALUE, reconnectInterval: 500, poolSize: 5, useNewUrlParser: true }

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(url, options);

mongoose.connection.on('error', (err) => {
  console.log('Erro na conexão com o banco de dados: ' + err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Aplicação desconectada do banco de dados');
});

mongoose.connection.on('connected', () => {
  console.log('Aplicação conectada ao banco de dados!');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const indexRoute = require('./Routes/index');
const usersRoutes = require('./Routes/users');

app.use('/', indexRoute);
app.use('/users', usersRoutes);

app.listen(3000);

module.exports = app;