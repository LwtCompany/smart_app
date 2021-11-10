const express = require('express');
const app = express();
const routes = require('./routes/index.route');
const db = require('./config/database.config');
const cors = require('cors');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use(express.static(path.join(__dirname, './pages')));

app.use("*", cors());


db.authenticate()
     .then(() => {
          console.log('database connected');
     })
     .catch(err => {
          console.error('Error database disconnected ->:', err);
     });



app.use('/', routes);


module.exports = app;
