const jwt = require('jsonwebtoken');
const { secretkey } = require('../config/env.config');

const socketVerify = (token) => {
          let data = {
               message: "success",
               status: true,
            
          };
          if (!token){
               data = {
                    message: "Token not found",
                    status: false,
                   
               };
          } 
          jwt.verify(token, secretkey, function (err) {
               if (err) data = {
                    message: "User not authorized",
                    status: false,
                   
               };
               
          });
        
     return data;
}

module.exports = socketVerify;

