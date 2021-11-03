const express = require('express');
const router = express.Router();


router.use('*', (req, res, next) => {
    return res.status(404)
         .send('Kechirasiz sahifa topilmadi!  :(404');
});

module.exports = router;