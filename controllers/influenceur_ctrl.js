const influenceur = require('../models/influenceur');
const cookie_mdl = require('../models/cookie');
const annonces = require('../models/annonces');
const jwt = require('jsonwebtoken');

module.exports= {
    profil_get: async (req,res)=>{
        try{
            await influenceur.is_influenceur(req,res);
            const flash = cookie_mdl.getFlash(req);
            cookie_mdl.destroyFlash(res);
            res.render('pages/influenceur/profil',{flash :flash});
        }catch (e) {
            const flash = {
                type: "alert-danger",
                code: 401,
                mess: e,
            };
            console.log('qsdqsdqsdsqds');
            cookie_mdl.setFlash(flash,res);
            cookie_mdl.destroyToken(req,res);
            res.redirect('/');
        }

    },


    inf_get: (req,res)=> {
        res.redirect('/influenceur/profil')
    },
    annonces_get: async(req,res)=>{
        try {
            await influenceur.is_influenceur(req,res);
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
    },
};