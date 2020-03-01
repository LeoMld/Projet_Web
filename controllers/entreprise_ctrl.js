const entreprise = require('../models/entreprise');
const annonces = require('../models/annonces');
const home = require('../models/home');
const cookie_mdl = require('../models/cookie');
const moment = require('moment');
moment.locale('fr');


module.exports= {
    profil_get: async  (req,res)=>{
        try{
            const infos = await entreprise.get_infos(req,res);
            const flash = cookie_mdl.getFlash(req);
            cookie_mdl.destroyFlash(res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/entreprise/profil',{flash :flash, infos:infos});
        }catch (e) {
            const flash={
                type: "alert-danger",
                code: 503,
                mess:"Votre profil n'est pas accessible pour le moment",
            };
            cookie_mdl.setFlash(flash,res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/entreprise/annonces', { flash: flash});
        }


    },

    ent_get: (req,res)=> {
        res.redirect('/entreprise/profil')
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
            res.render('pages/entreprise/annonces', {annonces: annonces_en_ligne, flash:flash, public:public_,cat:cat});
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
            res.render('pages/entreprise/annonces', { flash: flash});
        }
    },
    my_ads_get: async (req,res)=>{

        try{
            const flash = cookie_mdl.getFlash(req);
            cookie_mdl.destroyFlash(res);
            const annonces_en_ligne = await entreprise.get_my_ads(req, res);
            const public_ = await home.getPublic();
            const cat = await home.getCat();
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/entreprise/my_ads', {annonces: annonces_en_ligne,flash:flash, public:public_,cat:cat});
        }catch (e) {
            if(e === 1){
                const flash = {
                    type: "alert-danger",
                    code: 401,
                    mess: "Erreur vous avez été déconnecté",
                };
                cookie_mdl.setFlash(flash,res);
                cookie_mdl.destroyToken(req,res);
                res.redirect('/');
            }else{
                const flash = {
                    type: "alert-danger",
                    code: 503,
                    mess: "Désolé, le service est momentanément indisponibles",
                };
                cookie_mdl.setFlash(flash,res);
                if(typeof flash != 'undefined'){
                    res.status(flash.code);
                }
                res.redirect('/');
            }
        }
    },
    my_ads_delete: async (req,res)=> {
        try{
            const id_delete=req.body.id;
            await entreprise.delete_id(id_delete);
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
            res.redirect('/admin/annonces/my_ads');
        }
    },
    create_ads_get: async (req,res)=> {
        const public_ = await home.getPublic(res);
        const cat = await home.getCat();
        const flash = cookie_mdl.getFlash(req);
        cookie_mdl.destroyFlash(res);
        if(typeof flash != 'undefined'){
            res.status(flash.code);
        }
        res.render('pages/entreprise/create_ads',{public: public_,flash:flash, cat:cat});
    },
    create_ads_post: async (req,res)=> {
        try {
            const titre = req.body.titre;
            const desc =req.body.desc;
            const public_ =req.body.public_;
            const cat = req.body.cat;
            await annonces.create_Annonce(titre,desc,public_,cat,req,res);
            const flash = {
                type: "alert-success",
                code: 201,
                mess: "Annonce créée avec succès",
            };
            cookie_mdl.setFlash(flash,res);
            res.redirect('/entreprise/annonces/my_ads');
        }catch (e) {
            const flash = {
                type: "alert-danger",
                code: 401,
                mess: e,
            };
            cookie_mdl.setFlash(flash,res);
            res.redirect('/entreprise/annonces/create_ads');
        }

    },
    view_ad: async (req,res)=> {
        try {
            const flash = cookie_mdl.getFlash(req);
            const public_ = await home.getPublic();
            const cat = await home.getCat();
            const annonce = await annonces.get_Annonce(req,res,req.params.id);
            const avis = await annonces.get_Avis(req,res,annonce.id_annonce,req.params.id);
            console.log(avis)
            cookie_mdl.destroyFlash(res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            if(typeof annonce[0] != 'undefined'){
                const avis = await annonces.get_Avis(req,res,annonce[0].id_annonce);
                res.render('pages/entreprise/view_ad',{annonce : annonce,public: public_,flash:flash, cat:cat, avis:avis,moment:moment});
            }else {
                const flash = {
                    type: "alert-danger",
                    code: 401,
                    mess: "Cette annonce n'existe pas",
                };
                cookie_mdl.setFlash(flash,res);
                res.redirect('/entreprise/annonces');
            }

        }catch(e){
            const flash = {
                type: "alert-danger",
                code: 401,
                mess: e,
            };
            cookie_mdl.setFlash(flash,res);
            res.redirect('/entreprise/annonces');
        }
    },

    modify_ad_get: async(req,res)=> {
        try{
            const annonce = await annonces.get_Annonce(req,res,req.params.id);
            const public_ = await home.getPublic();
            const cat = await home.getCat();
            const id = req.params.id;
            const flash = cookie_mdl.getFlash(req);
            cookie_mdl.destroyFlash(res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/entreprise/modify_ad',{annonce : annonce,public: public_,flash:flash, cat:cat, id:id});
        }catch (e) {
            const flash = {
                type: "alert-danger",
                code: 401,
                mess: e,
            };
            cookie_mdl.setFlash(flash,res);
            res.redirect('/entreprise/annonces/my_ads');
        }

    },
    modify_ad_put: async(req,res)=> {
        try{
            const id_annonce=req.body.id;
            const titre_annonce = req.body.titre1;
            const desc_annonce = req.body.desc;
            const public_annonce = req.body.public1;
            const cat_annonce = req.body.cat;
            console.log(id_annonce,titre_annonce,desc_annonce,public_annonce,cat_annonce);
            await entreprise.my_ad_put(id_annonce, titre_annonce,desc_annonce,public_annonce,cat_annonce);
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
            res.redirect('/entreprise/annonces/my_ads');
        }

    },

};