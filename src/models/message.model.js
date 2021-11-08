'use strict';
const Sequelize = require('sequelize');
const db = require('../config/database.config');
const moment = require('moment');
const modelUser = require('./user.model');

const Message = db.define('message', {
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    room_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    to_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    file_url: {
        type: Sequelize.STRING(200),
    },
    message: {
        type: Sequelize.STRING(500)
    },
    created_at:{
        type: Sequelize.STRING(60),
        defaultValue: moment().format('MMMM Do YYYY, h:mm:ss a')
    }
},
     {
          freezeTableName: true,
          timestamps: false
     }
);
Message.belongsTo(modelUser, { as: 'user', foreignKey: 'user_id' });
Message.belongsTo(modelUser, { as: 'to', foreignKey: 'to_id' });

module.exports = Message;