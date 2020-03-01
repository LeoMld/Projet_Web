/*BEFORE LOGIN OR REGISTER*/

const express = require('express');
const router = express.Router();
const cookie_mdl = require('../models/cookie');
const influenceur = require('../models/influenceur');
const influenceur_ctrl = require('../controllers/influenceur_ctrl');


router.use( async (req,res,next)=>{
    try {
        await influenceur.is_influenceur(req, res);
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

router.get('/', influenceur_ctrl.inf_get);
router.get('/profil', influenceur_ctrl.profil_get);

router.put('/profil/modify',influenceur_ctrl.modify_profil_put);
router.get('/profil/modify',influenceur_ctrl.modify_profil_get);

router.get('/annonces', influenceur_ctrl.annonces_get);

router.get('/annonces/:id', influenceur_ctrl.view_ad_get);
router.post('/annonces/:id',influenceur_ctrl.view_ad_post);

router.get('/profil-entreprise/:id', influenceur_ctrl.profil_entreprise);

router.get('/partenaires', influenceur_ctrl.partenaires_get);

module.exports = router;