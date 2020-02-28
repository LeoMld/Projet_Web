/*BEFORE LOGIN OR REGISTER*/

const express = require('express');
const cookie_mdl = require('../models/cookie');
const admin = require('../models/admin');
const router = express.Router();
const admin_ctrl = require('../controllers/admin_ctrl');

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
router.get('/',admin_ctrl.admin_get);
router.get('/profil', admin_ctrl.profil_get);

router.get('/annonces/check', admin_ctrl.check_get);
router.post('/annonces/check', admin_ctrl.check_post);



module.exports = router;