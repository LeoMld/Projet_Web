/*BEFORE LOGIN OR REGISTER*/

const express = require('express');
const cookie_mdl = require('../models/cookie');
const admin = require('../models/admin');
const router = express.Router();
const admin_ctrl = require('../controllers/admin_ctrl');
const entreprise_ctrl = require('../controllers/entreprise_ctrl');
const influenceur_ctrl = require('../controllers/influenceur_ctrl');


router.use( async (req,res,next)=>{
    try {
        await admin.is_admin(req, res);
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

router.get('/annonces', admin_ctrl.annonces_get);
router.delete('/annonces', admin_ctrl.annonces_delete);

router.get('/annonces/:id', admin_ctrl.view_ad_get);
router.delete('/annonces/:id', admin_ctrl.view_avis_delete);

router.get('/',admin_ctrl.admin_get);
router.get('/profil', admin_ctrl.profil_get);

router.get('/annonces_check', admin_ctrl.check_get);
router.put('/annonces_check', admin_ctrl.check_put);
router.delete('/annonces_check',admin_ctrl.check_delete);

router.get('/manage_inf',admin_ctrl.manage_inf_get);
router.delete('/manage_inf',admin_ctrl.manage_inf_del);
router.get('/manage_ent',admin_ctrl.manage_ent_get);
router.delete('/manage_ent',admin_ctrl.manage_ent_del);

router.get('/profil_inf/:id',admin_ctrl.profil_influenceur_get);
router.get('/profil_ent/:id',admin_ctrl.profil_entreprise_get);


module.exports = router;