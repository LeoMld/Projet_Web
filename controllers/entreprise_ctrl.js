const entreprise = require('../models/entreprise');
const influenceur = require('../models/influenceur');
const annonces = require('../models/annonces');
const home = require('../models/home');
const cookie_mdl = require('../services/cookie');
const jwt = require('jsonwebtoken');
const moment = require('moment');
moment.locale('fr');


module.exports= {
    //affiche le profil d'une entreprise avec ses informations
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
            res.render('pages/entreprise/profil', { flash: flash});
        }


    },
    //si on tente de revenir sur la page de connexion ou d'enregistrement ce controleur redirigera vers le profil.
    ent_get: (req,res)=> {
        res.redirect('/entreprise/profil')
    },

    //afficher les annonces en ligne
    annonces_get: async (req,res)=> {

        let flash = cookie_mdl.getFlash(req);
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
            flash={
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
    //afficher les annonces correspondants a l'entreprise connectée
    my_ads_get: async (req,res)=>{
        let flash = cookie_mdl.getFlash(req);
        try{
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
                flash = {
                    type: "alert-danger",
                    code: 401,
                    mess: "Erreur vous avez été déconnecté",
                };
                cookie_mdl.setFlash(flash,res);
                cookie_mdl.destroyToken(req,res);
                res.redirect('/');
            }else{
                flash = {
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
    //supprimer une annonce
    my_ads_delete: async (req,res)=> {
        try{
            const id_delete = req.body.id;
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
    //afficher la page de création d'une annonce
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
    //créer une annonce
    create_ads_post: async (req,res)=> {
        try {
            const titre = req.sanitize(req.body.titre);
            const desc = req.sanitize(req.body.desc);
            const public_ = req.sanitize(req.body.public_);
            const cat = req.sanitize(req.body.cat);
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
    //afficher une annonce
    view_ad_get: async (req,res)=> {
        let flash = cookie_mdl.getFlash(req);
        try {
            const public_ = await home.getPublic();
            const cat = await home.getCat();
            const annonce = await annonces.get_Annonce(req,res,req.params.id);
            cookie_mdl.destroyFlash(res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            if(typeof annonce[0] != 'undefined'){
                const avis = await annonces.get_Avis(req,res,annonce[0].id_annonce);
                const moyenne = await annonces.get_moyenne(avis);
                res.render('pages/entreprise/view_ad',{annonce : annonce,public: public_,flash:flash, cat:cat, avis:avis,moment:moment,moyenne:moyenne});
            }else {
                flash = {
                    type: "alert-danger",
                    code: 401,
                    mess: "Cette annonce n'existe pas",
                };
                cookie_mdl.setFlash(flash,res);
                res.redirect('/entreprise/annonces');
            }

        }catch(e){
            flash = {
                type: "alert-danger",
                code: 401,
                mess: e,
            };
            cookie_mdl.setFlash(flash,res);
            res.redirect('/entreprise/annonces');
        }
    },
    //afficher la page de modification d'une annonce
    modify_ad_get: async(req,res)=> {
        let flash = cookie_mdl.getFlash(req);
        try{
            const annonce = await annonces.get_Annonce(req,res,req.params.id);
            const public_ = await home.getPublic();
            const cat = await home.getCat();
            const id = req.params.id;
            cookie_mdl.destroyFlash(res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/entreprise/modify_ad',{annonce : annonce,public: public_,flash:flash, cat:cat, id:id});
        }catch (e) {
            flash = {
                type: "alert-danger",
                code: 401,
                mess: e,
            };
            cookie_mdl.setFlash(flash,res);
            res.redirect('/entreprise/annonces/my_ads');
        }

    },
    //modifier une annonce
    modify_ad_put: async(req,res)=> {
        try{
            const id_annonce = req.sanitize(req.body.id);
            const titre_annonce = req.sanitize(req.body.titre1);
            const desc_annonce = req.sanitize(req.body.desc);
            const public_annonce = req.sanitize(req.body.public1);
            const url = req.sanitize(req.body.website);
            const cat_annonce = req.sanitize(req.body.cat);
            await entreprise.my_ad_put(id_annonce, titre_annonce,desc_annonce,public_annonce,cat_annonce,url);
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
    //afficher la page de modification de son profil
    modify_profil_get: async (req,res)=> {
        let flash = cookie_mdl.getFlash(req);
        try{
            const infos_entreprise= await entreprise.get_infos(req,res);
            cookie_mdl.destroyFlash(res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/entreprise/modify_profile',{flash:flash, infos:infos_entreprise});
        }catch (e) {
            flash = {
                type: "alert-danger",
                code: 401,
                mess: e,
            };
            cookie_mdl.setFlash(flash,res);
            res.redirect('/entreprise/profil');
        }
    },
    //modifier son profil
    modify_profil_put:async (req,res)=> {
        try{
            const REGEX_MAIL = /(?:[a-z0-9!#$%&'+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
            const nom = req.sanitize(req.body.nom);
            let mail = req.sanitize(req.body.mail);
            const tel = req.sanitize(req.body.tel);
            const desc = req.sanitize(req.body.desc);
            const website = req.sanitize(req.body.website);
            if(!REGEX_MAIL.test(mail)){
                mail=null;
            }
            const infos = await entreprise.get_infos(req,res);
            await entreprise.profil_put(nom,mail,tel,desc,website, infos[0].id_Entreprise);
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
            res.redirect('/entreprise/profil');
        }

    },
    //Afficher les intêrets liés à une entreprise
    interest_ad_get: async (req,res)=> {
        let flash = cookie_mdl.getFlash(req);
        try{
            const infos_inf = await annonces.get_influenceurs_interet(req,res);
            cookie_mdl.destroyFlash(res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/entreprise/influenceurs_interest',{flash:flash, infos:infos_inf});
        }catch (e) {
            flash = {
                type: "alert-danger",
                code: 401,
                mess: e,
            };
            cookie_mdl.setFlash(flash,res);
            res.redirect('/entreprise/annonces/my_ads');
        }
    },
    //afficher le profil d'un influenceur
    profil_inf_get: async (req,res)=> {
        let flash = cookie_mdl.getFlash(req);
        try{
            const infos = await influenceur.get_infos_inf(req,res,req.params.id);
            cookie_mdl.destroyFlash(res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/entreprise/profil_inf',{flash :flash, infos:infos});
        }catch (e) {
            flash={
                type: "alert-danger",
                code: 503,
                mess:"Ce profil n'est pas accessible pour le moment",
            };
            cookie_mdl.setFlash(flash,res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/entreprise/profil', { flash: flash});
        }


    },
    //afficher la page de modification du mot de passe
    modify_password_get:(req,res)=> {
        let flash = cookie_mdl.getFlash(req);
        try{
            cookie_mdl.destroyFlash(res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/entreprise/modify_pwd',{flash :flash});
        }catch (e) {
            flash={
                type: "alert-danger",
                code: 503,
                mess:"Impossible de changer votre mot de passe pour le moment",
        };
            cookie_mdl.setFlash(flash,res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/entreprise/profil', { flash: flash});
        }
    },
    //modifier un mot de passe
    modify_password_put: async (req,res)=> {
        try{
            const REGEX_PWD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_#])([-+!*$@%_#\w]{8,35})$/;
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
                    const mdp_ok = await entreprise.mdp_ok(req, res, infos_Token.userId, ancien_pwd);
                    if (new_pwd_conf === new_pwd && mdp_ok) {
                        await entreprise.modify_mdp(req, res, infos_Token.userId, new_pwd);
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