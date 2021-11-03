const express = require('express');
const app = express();
const routes = require('./routes/index.route');
const db = require('./config/database.config');

db.authenticate()
     .then(() => {
          console.log('Baza bilan aloqa ulandi');
     })
     .catch(err => {
          console.error('Baza bilan aloqa uzildi xatolik ->:', err);
     });

app.use(express.json());

app.use('/', routes);


module.exports = app;
