const influenceur = require('../models/influenceur');
const entreprise = require('../models/entreprise');
const home = require('../models/home');
const cookie_mdl = require('../models/cookie');
const annonces = require('../models/annonces');
const moment = require('moment');
moment.locale('fr');



module.exports= {
    profil_get: async (req,res)=>{
        const flash = cookie_mdl.getFlash(req);
        cookie_mdl.destroyFlash(res);
        res.render('pages/influenceur/profil',{flash :flash});

    },


    inf_get: (req,res)=> {
        res.redirect('/influenceur/profil')
    },
    annonces_get: async(req,res)=>{
        const flash = cookie_mdl.getFlash(req);
        cookie_mdl.destroyFlash(res);
        try{
            const annonces_en_ligne = await annonces.get_Annonces(req, res);
            const public_ = await home.getPublic();
            const cat = await home.getCat();
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/influenceur/annonces', {annonces: annonces_en_ligne, flash:flash, public:public_, cat:cat});
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
            res.render('pages/influenceur/annonces', { flash: flash});
        }
    },
    view_ad: async (req,res)=> {
        try {
            const flash = cookie_mdl.getFlash(req);
            const annonce = await annonces.get_Annonce(req,res,req.params.id);
            const public_ = await home.getPublic();
            const cat = await home.getCat();
            cookie_mdl.destroyFlash(res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            if(typeof annonce[0] != 'undefined'){
                const avis = await annonces.get_Avis(req,res,annonce[0].id_annonce);
                console.log(avis);
                res.render('pages/influenceur/view_ad',{annonce : annonce,avis:avis,public: public_,flash:flash, cat:cat,moment:moment});
            }else {
                const flash = {
                    type: "alert-danger",
                    code: 401,
                    mess: "Cette annonce n'existe pas",
                };
                cookie_mdl.setFlash(flash,res);
                res.redirect('/influenceur/annonces');
            }

        }catch(e){
            const flash = {
                type: "alert-danger",
                code: 401,
                mess: e,
            };
            cookie_mdl.setFlash(flash,res);
            res.redirect('/influenceur/annonces');
        }
    },

    profil_entreprise: async (req,res)=> {
        try{
            const entreprise_ = await entreprise.get_infos(req,res);
            const flash = cookie_mdl.getFlash(req);
            cookie_mdl.destroyFlash(res);
            if(typeof flash != 'undefined') {
                res.status(flash.code);
            }
            if(typeof entreprise_[0] != 'undefined'){
                res.render('pages/influenceur/profil_entreprise',{entreprise:entreprise_, flash:flash});

            }else{
                const flash = {
                    type: "alert-danger",
                    code: 404,
                    mess: "Ce profil est indisponible",
                };
                cookie_mdl.setFlash(flash,res);
                res.redirect('/influenceur/annonces');
            }

        }catch (e) {
            const flash = {
                type: "alert-danger",
                code: 503,
                mess: e,
            };
            cookie_mdl.setFlash(flash,res);
            res.redirect('/influenceur/annonces');
        }
        },
    partenaires_get: async(req,res)=> {
        const flash = cookie_mdl.getFlash(req);
        cookie_mdl.destroyFlash(res);
        try{
            const entreprise_ = await entreprise.get_entreprises();
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/influenceur/partenaires', {entreprises:entreprise_, flash:flash});
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
            res.render('pages/influenceur/partenaire', { flash: flash});
        }
    },
};