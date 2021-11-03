'use strict';
const Sequelize = require('sequelize');
const db = require('../config/database.config');

// const ModelPosition = require('./position.model');
// const ModelSection = require('./section.model');


const User = db.define('user', {
    full_name: {
        type: Sequelize.STRING(20),
        allowNull: false,
       
    },
    login: {
        type: Sequelize.STRING(20),
        allowNull: false,
      
    },
    password: {
        type: Sequelize.STRING(30),
        allowNull: false
    }
},
     {
          freezeTableName: true,
          timestamps: false
     }
);
// Staff.belongsTo(ModelPosition, { as: 'position', foreignKey: 'position_id' });
// ModelSection.hasMany(Staff, { as: 'staff', foreignKey: 'section_id' });
// Staff.belongsTo(ModelSection, { as: 'section', foreignKey: 'section_id' });
module.exports = User;