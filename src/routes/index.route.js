const express = require('express');
const router = express.Router();
const path = require('path');
const verifyToken = require('../service/jwt_verify');

const {
    getUsers,
    createUser,
    login,
    createMessage,
    getMessages
} = require('../controllers/user.controller');

router.post('/registration', createUser);
router.get('/login', login);

router.post('/createMessage', createMessage);
router.get('/getMessages', getMessages);

router.get('/',function(req,res){  
    res.sendFile(path.join(__dirname, '../pages/signUp.html'));  
});  

router.use(verifyToken());
router.get('/userList', getUsers);

router.use('*', (req, res, next) => {
    return res.status(404)
         .send('Sorry page not found!  :(404');
});

module.exports = router;