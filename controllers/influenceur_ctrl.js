const influenceur = require('../models/influenceur');
const entreprise = require('../models/entreprise');
const home = require('../models/home');
const cookie_mdl = require('../services/cookie');
const annonces = require('../models/annonces');
const jwt = require('jsonwebtoken');
const moment = require('moment');
moment.locale('fr');



module.exports= {
    profil_get: async (req,res)=>{
        try{
            const infos = await influenceur.get_infos(req,res);
            infos[0].date_naissance_I = moment(infos[0].date_naissance_I).format("DD MMMM YYYY");
            const flash = cookie_mdl.getFlash(req);
            cookie_mdl.destroyFlash(res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/influenceur/profil',{flash :flash, infos:infos});
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
            res.render('pages/influenceur/profil', { flash: flash});
        }

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
    view_ad_get: async (req,res)=> {
        try {
            const flash = cookie_mdl.getFlash(req);
            const annonce = await annonces.get_Annonce(req,res,req.params.id);
            const a_postule = await influenceur.a_postule(req,res,req.params.id); //return true si l'influenceur à déja postulé pour l'annonce, false sinon.
            const nb_avis = await annonces.nb_Avis(req,res);
            const public_ = await home.getPublic();
            const cat = await home.getCat();
            cookie_mdl.destroyFlash(res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            if(typeof annonce[0] != 'undefined'){
                const avis = await annonces.get_Avis(req,res,annonce[0].id_annonce);
                const moyenne = await annonces.get_moyenne(avis);
                res.render('pages/influenceur/view_ad',{a_postule:a_postule,annonce : annonce,avis:avis,nb_avis:nb_avis,public: public_,flash:flash, cat:cat,moment:moment,moyenne:moyenne});
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
    view_ad_post: async (req,res)=> {
        try {
            const rating = req.sanitize(req.body.rating);
            const new_avis = req.sanitize(req.body.new_avis);
            await annonces.create_Avis(req,res,rating,new_avis,req.params.id);
            const flash = {
                type: "alert-success",
                code: 201,
                mess: "Avis créé avec succès",
            };
            cookie_mdl.setFlash(flash,res);
            res.redirect('/influenceur/annonces/'+req.params.id);
        }catch (e) {
            const flash = {
                type: "alert-danger",
                code: 401,
                mess: e,
            };
            cookie_mdl.setFlash(flash,res);
            res.redirect('/influenceur/annonces/'+req.params.id);
        }
    },

    profil_entreprise: async (req,res)=> {
        try{
            const infos_entreprise = await entreprise.get_infos_ent(req,res);
            const flash = cookie_mdl.getFlash(req);
            cookie_mdl.destroyFlash(res);
            if(typeof flash != 'undefined') {
                res.status(flash.code);
            }
            if(typeof infos_entreprise[0] != 'undefined'){
                res.render('pages/influenceur/profil_entreprise',{infos:infos_entreprise, flash:flash});

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
    modify_profil_get: async (req,res)=> {
        try{
            const infos = await influenceur.get_infos(req,res);
            infos[0].date_naissance_I = moment(infos[0].date_naissance_I).format("YYYY-DD-MM");
            const public_ = await home.getPublic();
            const flash = cookie_mdl.getFlash(req);
            cookie_mdl.destroyFlash(res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/influenceur/modify_profile',{flash:flash, infos:infos,public:public_});
        }catch (e) {
            const flash = {
                type: "alert-danger",
                code: 401,
                mess: e,
            };
            cookie_mdl.setFlash(flash,res);
            res.redirect('/influenceur/profil');
        }
    },
    modify_profil_put: async (req,res)=> {
        try{
            const REGEX_MAIL = /(?:[a-z0-9!#$%&'+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
            const nom = req.sanitize(req.body.nom);
            let mail = req.sanitize(req.body.mail);
            const prenom = req.sanitize(req.body.prenom);
            const date = req.sanitize(req.body.date);
            const public_ = req.sanitize(req.body.public_);
            const nom_Inf = req.sanitize(req.body.nom_Inf);
            if(!REGEX_MAIL.test(mail)){
                mail=null;
            }
            const infos = await influenceur.get_infos(req,res);
            await influenceur.profil_inf_put(nom,mail,prenom,date,public_,nom_Inf, infos[0].id_Influenceur);
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
            res.redirect('/influenceur/profil');
        }

    },
    ad_postuler_post: async (req,res)=> {
        try{
            const id_post=req.body.id;
            await influenceur.ad_postuler(req,res,id_post);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ status: 200 }));
            res.end();
        }catch (e) {
            console.log('erreur lors de la postulation')
        }
    },

    modify_pwd_get: async (req,res)=> {
        try{
            const flash = cookie_mdl.getFlash(req);
            cookie_mdl.destroyFlash(res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/influenceur/modify_pwd',{flash :flash});
        }catch (e) {
            const flash={
                type: "alert-danger",
                code: 503,
                mess:"Impossible de changer votre mot de passe pour le moment",
            };
            cookie_mdl.setFlash(flash,res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/influenceur/profil', { flash: flash});
        }
    },
    modify_pwd_put: async (req,res)=> {
        try{
            const REGEX_PWD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_#])([-+!*$@%_#\w]{8,15})$/;
            const ancien_pwd = req.sanitize(req.body.ancien_pwd);
            const new_pwd = req.sanitize(req.body.new_pwd);
            const new_pwd_conf = req.sanitize(req.body.new_pwd_conf);
            const token = cookie_mdl.getToken(req,res);
            if (!REGEX_PWD.test(new_pwd)) {
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.write(JSON.stringify({status: 400}));
                res.end();
            }
            jwt.verify(token, cookie_mdl.getKey(), async(err, infos_Token) => {
                try{
                    const mdp_ok = await influenceur.pwd_ok(req, res, infos_Token.userId, ancien_pwd);
                    if (new_pwd_conf === new_pwd && mdp_ok) {
                        await influenceur.modify_pwd(req, res, infos_Token.userId, new_pwd);
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.write(JSON.stringify({status: 200}));
                        res.end();
                    } else {
                        res.writeHead(400, {'Content-Type': 'application/json'});
                        res.write(JSON.stringify({status: 400}));
                        res.end();
                    }
                }catch (e) {
                    console.log("Erreur lors de la mofification du mot de passe");
                }

            })

        }catch (e) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ status: 400 }));
            res.end();
        }

    }
};