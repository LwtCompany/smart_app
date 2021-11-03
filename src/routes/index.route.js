const express = require('express');
const router = express.Router();
const {
    createUser,
    login
} = require('../controllers/auth.controller');

const {
    getUsers
} = require('../controllers/user.controller');

router.post('/registration', createUser);
router.get('/login', login);


router.get('/userList', getUsers);

router.use('*', (req, res, next) => {
    return res.status(404)
         .send('Sorry page not found!  :(404');
});

module.exports = router;