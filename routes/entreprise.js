/*BEFORE LOGIN OR REGISTER*/

const express = require('express');
const router = express.Router();
const entreprise_ctrl = require('../controllers/entreprise_ctrl');

router.get('/',entreprise_ctrl.ent_get);
router.get('/profil', entreprise_ctrl.profil_get);

router.get('/annonces', entreprise_ctrl.annonces_get);

router.get('/annonces/my_ads', entreprise_ctrl.my_ads_get);

router.get('/annonces/create_ads', entreprise_ctrl.create_ads_get);
router.post('/annonces/create_ads', entreprise_ctrl.create_ads_post);

module.exports = router;