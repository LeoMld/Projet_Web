const cookie_mdl = require('../models/cookie');
const entreprise = require('../models/entreprise');
/*BEFORE LOGIN OR REGISTER*/

const express = require('express');
const router = express.Router();
const entreprise_ctrl = require('../controllers/entreprise_ctrl');

router.use( async (req,res,next)=>{
    try {
        await entreprise.is_entreprise(req, res);
    }catch (e) {
        const flash = {
            type: "alert-danger",
            code: 401,
            mess: e,
        };
        cookie_mdl.setFlash(flash,res);
        cookie_mdl.destroyToken(req,res);
        res.redirect('/');
    }
    next();
});

router.get('/',entreprise_ctrl.ent_get);
router.get('/profil', entreprise_ctrl.profil_get);

router.get('/annonces', entreprise_ctrl.annonces_get);

router.get('/annonces/my_ads', entreprise_ctrl.my_ads_get);

router.get('/annonces/create_ads', entreprise_ctrl.create_ads_get);
router.post('/annonces/create_ads', entreprise_ctrl.create_ads_post);

router.get('/annonces/:id',entreprise_ctrl.view_ad);

module.exports = router;