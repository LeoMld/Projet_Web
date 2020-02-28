const admin = require('../models/admin');
const home = require('../models/home');
const cookie_mdl = require('../models/cookie');



module.exports= {
    profil_get: (req,res)=>{
        const flash = cookie_mdl.getFlash(req);
        cookie_mdl.destroyFlash(res);
        res.render('pages/admin/profil', {flash: flash});

    },
    admin_get: (req,res)=> {
        res.redirect('/admin/profil')
    },
    check_get: async(req,res)=> {
        try{
            const annonces_check = await admin.annonces_check();
            const public_ = await home.getPublic();
            const cat = await home.getCat();
            const flash = cookie_mdl.getFlash(req);
            cookie_mdl.destroyFlash(res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/admin/check',{flash:flash, annonces_check:annonces_check,public:public_, cat:cat});
        }catch (e) {
            const flash = {
                type: "alert-danger",
                code: 401,
                mess: e,
            };
            cookie_mdl.setFlash(flash,res);
            res.redirect('/admin/check');
        }

    },
    check_post: async(req,res)=> {
        try{
            const id_valid=req.body.valid;
            await admin.valid_id(id_valid);
            const flash = {
                type: "alert-success",
                code: 202,
                mess: "Annonce validée !",
            };
            cookie_mdl.setFlash(flash,res);
            res.redirect('/admin/annonces/check');
        }catch (e) {

        }

    }
};