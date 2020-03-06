const admin = require('../models/admin');
const entreprise = require('../models/entreprise');
const influenceur = require('../models/influenceur');
const home = require('../models/home');
const cookie_mdl = require('../services/cookie');
const annonces = require('../models/annonces');
const moment = require('moment');
moment.locale('fr');



module.exports= {
    //controleur de la page de profil de l'admin
    profil_get: (req,res)=>{
        const flash = cookie_mdl.getFlash(req);
        cookie_mdl.destroyFlash(res);
        res.render('pages/admin/profil', {flash: flash});

    },
    //si la personne essaye de saisir la route de l'accueil mais qu'elle est connectée, elle sera redirigée vers ce controleur qui redirigera lui-meme vers le profilde l'admin
    admin_get: (req,res)=> {
        res.redirect('/admin/profil')
    },
    /*controleur pour la verification des annonces avant leur mise en ligne*/
    check_get: async(req,res)=> {
        try{
            //on récupère les annonces
            const annonces_check = await admin.annonces_check();
            //on récupère tous les publics et les catégories pour pouvoir associer les FK des annonces à un type et une catégorie
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
    //Controleur lors de la validation d'une annonce par l'administrateur
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
    //lorsque que l'annonce est supprimée
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
    //Controleur affichant toutes les annonces en ligne
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
    //supprimer une annonce
    annonces_delete: async(req,res)=> {
        try{
            //on récupère l'id de l'annonce à supprimer
            const id_delete=req.body.id;
            //on delete
            await admin.delete_ad(id_delete);
            //on renvoi que tout s'est bien déroulé
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

    //affichage d'une seule annonce
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
    //supprimer un avis situé sous une annonce
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

    //affichage de toutes les entreprises inscrites
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
    //affichage de tous les influenceurs inscrits
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
    //supprimer un influenceur
    manage_inf_del: async (req,res)=> {
        try{
            const id_delete=req.body.id;
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
    //supprimer une entreprise
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

    //voir le profil d'un influenceur
    profil_influenceur_get: async (req,res)=> {
        try{
            const infos = await influenceur.get_infos_inf(req,res,req.params.id);
            const flash = cookie_mdl.getFlash(req);
            cookie_mdl.destroyFlash(res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/admin/profil_inf',{flash :flash, infos:infos});
        }catch (e) {
            const flash={
                type: "alert-danger",
                code: 503,
                mess:"Ce profil n'est pas accessible pour le moment",
            };
            cookie_mdl.setFlash(flash,res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/admin/profil_inf', { flash: flash});
        }
    },

    //voir le profil d'une entreprise
    profil_entreprise_get: async(req,res)=> {
            try{
                const infos_entreprise = await entreprise.get_infos_ent(req,res);
                const flash = cookie_mdl.getFlash(req);
                cookie_mdl.destroyFlash(res);
                if(typeof flash != 'undefined') {
                    res.status(flash.code);
                }
                if(typeof infos_entreprise[0] != 'undefined'){
                        res.render('pages/admin/profil_entreprise',{infos:infos_entreprise, flash:flash});
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

};