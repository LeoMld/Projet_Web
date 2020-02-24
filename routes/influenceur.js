/*BEFORE LOGIN OR REGISTER*/

const express = require('express');
const router = express.Router();
const influenceur_ctrl = require('../controllers/influenceur_ctrl');



router.get('/', influenceur_ctrl.profil_get);


module.exports = router;