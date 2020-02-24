/*BEFORE LOGIN OR REGISTER*/

const express = require('express');
const router = express.Router();
const entreprise_ctrl = require('../controllers/entreprise_ctrl');

router.get('/',entreprise_ctrl.ent_get);
router.get('/profil', entreprise_ctrl.profil_get);

module.exports = router;