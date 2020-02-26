const home = require('../models/home');
const jwt = require('jsonwebtoken');
//const sanitizer = require('express-sanitizer');
const cookie_mdl = require('../models/cookie');



module.exports= {


    home_connexion_get: function(req,res) {
        //verify if a token is already in cookies
        const token = cookie_mdl.getToken(req,res);
        if(typeof token !== 'undefined'){
            jwt.verify(token, cookie_mdl.getKey(), (err, infos_Token)=> {
                if (err) {
                    cookie_mdl.destroyToken(req,res);
                    res.redirect('/');
                } else {
                    if(infos_Token.type === 0){
                        res.redirect('/admin');
                    }else if (infos_Token.type === 1){
                        res.redirect('/influenceur');
                    }else{
                        res.redirect('/entreprise');
                    }
                }
            })

        }else{
            const flash= cookie_mdl.getFlash(req);
            cookie_mdl.destroyFlash(res);
            res.render('pages/home/home_connexion',{status_co:1,flash: flash});

        }

    },

    home_connexion_post: async (req,res1)=>{
        //post connexion
        const mail = req.sanitize(req.body.mail);
        const pwd = req.sanitize(req.body.pwd);

        if(mail != null && pwd != null){
            try{
                const result= await home.connect(req,res1,mail,pwd);
                if(result === 0){
                    res1.render('pages/home/home_connexion',{status_co:0});
                }else{
                    res1.redirect('/');
                }
            }catch (e) {
                const flash = {
                    mess:e,
                    //type alert-danger means red color for message
                    type:"alert-danger"
                };

                cookie_mdl.destroyToken(req,res1);
                cookie_mdl.setFlash(flash,res1);
                res1.redirect('/');
            }

        }else {
            const flash = {
                mess:"Erreur lors de la connexion",
                //type alert-danger means red color for message
                type:"alert-danger"
            };
            cookie_mdl.setFlash(flash, res1);
            res1.redirect('/');

        }

        //if there is no mail or password err status 500

        },



    //REGISTER PAGE CONTROLLERS
    home_register_get: async (req,res) =>{
        const public_ = await home.getPublic(res);
        const flash = cookie_mdl.getFlash(req);
        cookie_mdl.destroyFlash(res);
        res.render('pages/home/home_register',{public: public_,flash : flash});

    },

    //get data post and create a new user in database
    home_register_post: async (req,res) =>{
        const REGEX_MAIL = /(?:[a-z0-9!#$%&'+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        let result;
//test the type of register
        const name_I = req.sanitize(req.body.name_I);
        let flash = {
            mess:null,
            //type alert-danger means red color for message
            type:null
        };
        //register for entreprise
        if ( name_I == null){
            const name = req.sanitize(req.body.name_E);
            let mail = req.sanitize(req.body.mail_E);
            if(!REGEX_MAIL.test(mail)){
                mail=null;
            }
            const pwd = req.sanitize(req.body.pwd_E);

            if(mail == null || pwd == null ||  name == null ) {
                flash.mess="Erreur lors de l'inscription";
                flash.type="alert-danger";
                cookie_mdl.setFlash(flash, res);
                res.redirect('/register');
            }else{
                result = await home.register_E(name,mail,pwd);
                if (result[0] === undefined) {
                    flash.type="alert-success";
                    flash.mess="Bravo, votre compte a été créé avec succès";
                    cookie_mdl.setFlash(flash,res);
                    //status 1 means that register is ok
                    res.redirect('/register');
                } else {
                    flash.type="alert-danger";
                    flash.mess="Vous avez déja un compte avec ce mail";
                    cookie_mdl.setFlash(flash,res);
                    //status 2 means that user is already in database
                    res.redirect('/register');
                }
            }


        }else {
            //register for influenceur
            const surname = req.sanitize(req.body.surname_I);
            let mail = req.sanitize(req.body.mail_I);
            if(!REGEX_MAIL.test(mail)){
                mail=null;
            }
            const pwd = req.sanitize(req.body.pwd_I);
            const date = req.sanitize(req.body.date_I);
            const nom_Inf = req.sanitize(req.body.nameInf);
            const public_ = req.sanitize(req.body.public_);
            if (mail == null || pwd == null || date == null || surname == null || nom_Inf == null) {
                flash.mess="Erreur lors de l'inscription";
                flash.type="alert-danger";
                cookie_mdl.setFlash(flash, res);
                res.redirect('/register');
            }else{
                result = await home.register_I(name_I, surname, mail, pwd, date, nom_Inf, public_);
                if (result[0] === undefined) {
                    flash.type="alert-success";
                    flash.mess="Bravo, votre compte a été créé avec succès";
                    cookie_mdl.setFlash(flash,res);
                    //status 1 means that register is ok
                    res.redirect('/register');
                } else {
                    flash.type="alert-danger";
                    flash.mess="Vous avez déja un compte avec ce mail";
                    cookie_mdl.setFlash(flash,res);
                    //status 2 means that user is already in database
                    res.redirect('/register');
                }
            }

        }



    },

    home_contact_get:  (req,res)=> {
        res.send('contact');
    },

    //LOGOUT
    logout:(req,res)=>{
        const flash = {
            mess:"Vous avez été déconnecté",
            //type alert-success means green color for message
            type:"alert-success"
        };
        cookie_mdl.setFlash(flash, res);
        cookie_mdl.destroyToken(req,res);
        res.redirect('/');
    }
};


