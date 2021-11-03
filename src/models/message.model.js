'use strict';
const Sequelize = require('sequelize');
const db = require('../config/database.config');

// const ModelPosition = require('./position.model');
// const ModelSection = require('./section.model');


const Message = db.define('message', {
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    file_url: {
        type: Sequelize.STRING(200),
        allowNull: false,
        unique: true,
    },
    message: {
        type: Sequelize.STRING(500),
        allowNull: false
    },
    created_at:{
        type: Sequelize.DataTypes,
        defaultValue: Date()
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
module.exports = Message;