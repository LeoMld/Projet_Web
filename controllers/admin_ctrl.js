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
            res.render('pages/admin/check',{flash:flash});        }

    },
    check_put: async(req,res)=> {
        try{
            const id_valid=req.body.id;
            await admin.valid_id(id_valid);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ status: 200 }));
            res.end();
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
    check_delete: async (req,res)=> {
        try{
            const id_delete=req.body.id;
            await admin.delete_id(id_delete);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ status: 200 }));
            res.end();
        }catch (e) {
            const flash = {
                type: "alert-danger",
                code: 401,
                mess: e,
            };
            cookie_mdl.setFlash(flash,res);
            res.redirect('/admin/check');
        }


    }
};