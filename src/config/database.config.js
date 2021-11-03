const Sequelize = require('sequelize');
const { login, password, host, database } = require('./env.config');
// const pg_hstore = require('pg-hstore');

module.exports = new Sequelize(database, login, password, {
     host: host,
     dialect: 'postgres',
    //  dialectModule: pg_hstore,
     logging: false,
     pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
     }
});
