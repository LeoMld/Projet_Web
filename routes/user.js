/*AFTER LOGIN OR REGISTER*/

const express = require('express');
const router = express.Router();
const connected_ctrl = require('../controllers/user_ctrl');


router.get('/profile', connected_ctrl.profil_get);






module.exports = router;
