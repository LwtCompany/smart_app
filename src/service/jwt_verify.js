const jwt = require('jsonwebtoken');
const { secretkey } = require('../../config/index');

const verifyToken = (Roles) => {
     return (req, res, next) => {
          const token = req.headers['token'];

          if (!token) return res.status(403).json({
               message: "Token not found",
               status: false,
               error_code: 0,
               data: {}
          });

          jwt.verify(token, secretkey, function (err, decoded) {
               if (err) return res.status(401).json({
                    message: "User not authorized",
                    status: false,
                    error_code: 0,
                    data: {}
               });

               const result = Roles.find((e) => e === decoded.role);

               if (!result) return res.status(402).json({
                    message: 'You have not permission for this url',
                    status: false,
                    error_code: 0,
                    data: {}
               });

               next();
          });
     }
}

module.exports = verifyToken;

