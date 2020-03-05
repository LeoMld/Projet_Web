const cookie_mdl = require('../services/cookie');
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

router.put('/profil/modify',entreprise_ctrl.modify_profil_put);
router.get('/profil/modify',entreprise_ctrl.modify_profil_get);


router.get('/annonces', entreprise_ctrl.annonces_get);

router.use('/annonces/my_ads/:id', async (req,res,next)=> {
        try{
            await entreprise.is_my_ad(req,res);
        }catch(e){
            const flash = {
                type: "alert-danger",
                code: 401,
                mess: e,
            };
            cookie_mdl.setFlash(flash,res);
            cookie_mdl.destroyToken(req,res);
            res.redirect('/entreprise/annonces/my_ads');
        }
        next();
});
router.get('/annonces/my_ads/:id',entreprise_ctrl.modify_ad_get);
router.put('/annonces/my_ads/:id',entreprise_ctrl.modify_ad_put);

router.delete('/annonces/my_ads',entreprise_ctrl.my_ads_delete);
router.get('/annonces/my_ads', entreprise_ctrl.my_ads_get);

router.get('/annonces/my_ads/:id/interest',entreprise_ctrl.interest_ad_get);

router.get('/annonces/create_ads', entreprise_ctrl.create_ads_get);
router.post('/annonces/create_ads', entreprise_ctrl.create_ads_post);

router.get('/annonces/:id',entreprise_ctrl.view_ad_get);

router.get('/inf/:id',entreprise_ctrl.profil_inf_get);

module.exports = router;