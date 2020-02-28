const influenceur = require('../models/influenceur');
const entreprise = require('../models/entreprise');
const cookie_mdl = require('../models/cookie');
const annonces = require('../models/annonces');

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
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/influenceur/annonces', {annonces: annonces_en_ligne, flash:flash});
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
    view_ads: async (req,res)=> {
        try {
            const flash = cookie_mdl.getFlash(req);
            const annonce = await annonces.get_Annonce(req,res,req.params.id);
            cookie_mdl.destroyFlash(res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            if(typeof annonce[0] != 'undefined'){
                res.render('pages/influenceur/view_ads',{annonce : annonce, flash: flash});
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

    profil_entreprise: async (req,res)=> {
        try{
            const entreprise_ = await entreprise.get_infos(req,res);
            const flash = cookie_mdl.getFlash(req);
            cookie_mdl.destroyFlash(res);
            if(typeof flash != 'undefined') {
                res.status(flash.code);
            }
            res.render('pages/influenceur/profil_entreprise',{entreprise:entreprise_, flash:flash});
        }catch (e) {
            const flash = {
                type: "alert-danger",
                code: 401,
                mess: e,
            };
            cookie_mdl.setFlash(flash,res);
            res.redirect('/entreprise/annonces');
        }
        },
    partenaires_get: async(req,res)=> {
        const flash = cookie_mdl.getFlash(req);
        cookie_mdl.destroyFlash(res);
        try{
            const annonces_en_ligne = await annonces.get_Annonces(req, res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/influenceur/partenaires', {annonces: annonces_en_ligne, flash:flash});
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
};