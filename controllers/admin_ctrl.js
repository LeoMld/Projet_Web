const admin = require('../models/admin');
const entreprise = require('../models/entreprise');
const influenceur = require('../models/influenceur');
const home = require('../models/home');
const cookie_mdl = require('../models/cookie');
const annonces = require('../models/annonces');
const moment = require('moment');
moment.locale('fr');



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


    },
    annonces_get: async (req,res)=> {

        const flash = cookie_mdl.getFlash(req);
        cookie_mdl.destroyFlash(res);
        try{
            const annonces_en_ligne = await annonces.get_Annonces(req, res);
            const public_ = await home.getPublic();
            const cat = await home.getCat();
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/admin/annonces', {annonces: annonces_en_ligne, flash:flash, public:public_,cat:cat});
        }catch(e){
            const flash={
                type: "alert-danger",
                code: 503,
                mess:"Désolé, le service est momentanément indisponibles",
            };
            cookie_mdl.setFlash(flash,res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/admin/annonces', { flash: flash});
        }
    },
    view_ad_get: async (req,res)=> {
        try {
            const flash = cookie_mdl.getFlash(req);
            const public_ = await home.getPublic();
            const cat = await home.getCat();
            const annonce = await annonces.get_Annonce_all(req,res,req.params.id);
            cookie_mdl.destroyFlash(res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            if(typeof annonce[0] != 'undefined'){
                const avis = await annonces.get_Avis(req,res,annonce[0].id_annonce);
                const moyenne = await annonces.get_moyenne(avis);
                res.render('pages/admin/view_ad',{annonce : annonce,public: public_,flash:flash, cat:cat, avis:avis,moment:moment,moyenne:moyenne});
            }else {
                const flash = {
                    type: "alert-danger",
                    code: 401,
                    mess: "Cette annonce n'existe paaas",
                };
                cookie_mdl.setFlash(flash,res);
                res.redirect('/admin/annonces');
            }

        }catch(e){
            const flash = {
                type: "alert-danger",
                code: 401,
                mess: e,
            };
            cookie_mdl.setFlash(flash,res);
            res.redirect('/admin/annonces');
        }
    },
    view_avis_delete: async (req,res)=> {
        try{
            const id_delete=req.body.id;
            await admin.delete_avis(id_delete);
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

    annonces_delete: async(req,res)=> {
        try{
            const id_delete=req.body.id;
            await admin.delete_ad(id_delete);
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
    manage_ent_get: async (req,res)=> {
        try{
            const entreprises = await entreprise.get_entreprises();
            const flash = cookie_mdl.getFlash(req);
            cookie_mdl.destroyFlash(res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/admin/manage_ent',{flash:flash, entreprises : entreprises});
        }catch (e) {
            const flash = {
                type: "alert-danger",
                code: 401,
                mess: e,
            };
            cookie_mdl.setFlash(flash,res);
            res.render('pages/admin/manage_ent',{flash:flash});        }

    },
    manage_inf_get: async (req,res)=> {
        try{
            const influenceurs = await influenceur.get_influenceurs();
            const flash = cookie_mdl.getFlash(req);
            cookie_mdl.destroyFlash(res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/admin/manage_inf',{flash:flash, influenceurs : influenceurs});
        }catch (e) {
            const flash = {
                type: "alert-danger",
                code: 401,
                mess: e,
            };
            cookie_mdl.setFlash(flash,res);
            res.render('pages/admin/manage_inf',{flash:flash});        }

    },
    manage_inf_del: async (req,res)=> {
        try{
            const id_delete=req.body.id;
            console.log(id_delete)
            await admin.delete_inf(id_delete);
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
    manage_ent_del: async (req,res)=> {
        try{
            const id_delete=req.body.id;
            await admin.delete_ent(id_delete);
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

};