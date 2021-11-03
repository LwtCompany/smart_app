const dotenv = require('dotenv');
dotenv.config();


module.exports = {
     // endpoint: process.env.API_URL,
     // masterKey: process.env.API_KEY,
     port: process.env.PORT,
     database: process.env.DATABASE,
     host: process.env.HOST,
     login: process.env.LOGIN,
     secretkey: process.env.SECRET_KEY,
     keytime: '1d'
}