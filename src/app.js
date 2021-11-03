const express = require('express');
const app = express();
const routes = require('./routes/index.route');
const db = require('./config/database.config');

db.authenticate()
     .then(() => {
          console.log('database connected');
     })
     .catch(err => {
          console.error('Error database disconnected ->:', err);
     });

app.use(express.json());

app.use('/', routes);


module.exports = app;
