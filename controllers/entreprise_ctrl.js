const entreprise = require('../models/entreprise');
const annonces = require('../models/annonces');
const home = require('../models/home');
const cookie_mdl = require('../models/cookie');



module.exports= {
    profil_get: async (req,res)=>{
        try{
            await entreprise.is_entreprise(req,res);
            res.render('pages/entreprise/profil');
        }catch (e) {
            const flash = {
                type: "alert-danger",
                mess: e,
            };
            cookie_mdl.setFlash(flash,res);
            cookie_mdl.destroyToken(req,res);
            res.redirect('/');
        }

    },

    ent_get: (req,res)=> {
        res.redirect('/entreprise/profil')
    },

    annonces_get: async (req,res)=> {
        try {
            await entreprise.is_entreprise(req,res);
            const flash = cookie_mdl.getFlash(req);
            cookie_mdl.destroyFlash(res);
            try{
                const annonces_en_ligne = await annonces.get_Annonces(req, res);
                res.render('pages/entreprise/annonces', {annonces: annonces_en_ligne, flash:flash});
            }catch(e){
                const flash={
                    type: "alert-danger",
                    mess:"Désolé, le service est momentanément indisponibles",
                };
                cookie_mdl.setFlash(flash,res);
                res.render('pages/entreprise/annonces', { flash: flash});
            }

        }catch (e) {
            const flash = {
                type: "alert-danger",
                mess: e,
            };
            console.log(e);
            cookie_mdl.setFlash(flash,res);
            cookie_mdl.destroyToken(req,res);
            res.redirect('/');
        }


    },
    my_ads_get: async (req,res)=>{
        try{
            await entreprise.is_entreprise(req,res);
            const flash = cookie_mdl.getFlash(req);
            cookie_mdl.destroyFlash(res);
            const annonces_en_ligne = await entreprise.get_my_ads(req, res);
            res.render('pages/entreprise/my_ads', {annonces: annonces_en_ligne,flash:flash});
        }catch (e) {
            if(e === 1){
                const flash = {
                    type: "alert-danger",
                    mess: "Erreur vous avez été déconnecté",
                };
                cookie_mdl.setFlash(flash,res);
                cookie_mdl.destroyToken(req,res);
                res.redirect('/');
            }else{
                const flash = {
                    type: "alert-danger",
                    mess: "Désolé, le service est momentanément indisponibles",
                };
                cookie_mdl.setFlash(flash,res);
                res.render('pages/entreprise/my_ads',{flash:flash});
            }
        }
    },
    create_ads_get: async (req,res)=> {
        try {
            const public_ = await home.getPublic(res);
            await entreprise.is_entreprise(req, res);
            const flash = cookie_mdl.getFlash(req);
            cookie_mdl.destroyFlash(res);
            res.render('pages/entreprise/create_ads',{public: public_,flash:flash});
        }catch(e){
            const flash = {
                type: "alert-danger",
                mess: e,
            };
            console.log(e);
            cookie_mdl.setFlash(flash,res);
            res.redirect('/entreprise/annonces/my_ads');
        }
    },
    create_ads_post: async (req,res)=> {
        try {
            const titre = req.body.titre;
            const desc =req.body.desc;
            const public=req.body.public_;
            await entreprise.is_entreprise(req, res);
            const public_ = await home.getPublic(res);
            await annonces.create_Annonce(titre,desc,public,req,res);
            const flash = {
                type: "alert-success",
                mess: "Annonce créée avec succès",
            };
            cookie_mdl.setFlash(flash,res);
            res.redirect('/entreprise/annonces/my_ads');
        }catch (e) {
            const flash = {
                type: "alert-danger",
                mess: e,
            };
            console.log(e);
            cookie_mdl.setFlash(flash,res);
            res.redirect('/entreprise/annonces/create_ads');
        }

    },
};