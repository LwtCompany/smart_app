const express = require('express');
const router = express.Router();
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

router.use(verifyToken());
router.get('/userList', getUsers);

router.use('*', (req, res, next) => {
    return res.status(404)
         .send('Sorry page not found!  :(404');
});

module.exports = router;