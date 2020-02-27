/*BEFORE LOGIN OR REGISTER*/

const express = require('express');
const router = express.Router();
const influenceur_ctrl = require('../controllers/influenceur_ctrl');


router.get('/',influenceur_ctrl.inf_get);
router.get('/profil', influenceur_ctrl.profil_get);

router.get('/annonces', influenceur_ctrl.annonces_get);


module.exports = router;