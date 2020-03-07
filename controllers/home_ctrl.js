const home = require('../models/home');
const jwt = require('jsonwebtoken');
const cookie_mdl = require('../services/cookie');
const mail_service = require('../services/mail');


const REGEX_MAIL = /(?:[a-z0-9!#$%&'+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const REGEX_PWD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_#])([-+!*$@%_#\w]{8,15})$/;

module.exports= {
    //afficher la page de connexion
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
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/home/home_connexion',{status_co:1,flash: flash});

        }

    },
    //se connecter
    home_connexion_post: async (req,res1)=>{
        //post connexion
        const mail = req.sanitize(req.body.mail);
        const pwd = req.sanitize(req.body.pwd);

        if(mail != null && pwd != null){
            try{
                const result= await home.connect(req,res1,mail,pwd);
                if(result === 0){
                    if(typeof flash != 'undefined'){
                        res.status(flash.code);
                    }
                    res1.render('pages/home/home_connexion',{status_co:0});
                }else if(result === 2){
                    const flash = {
                        mess:"Votre compte n'est pas vérifié",
                        code: 401,
                        //type alert-danger means red color for message
                        type:"alert-danger"
                    };
                    cookie_mdl.setFlash(flash,res1);
                    res1.redirect('/register/verify');
                }else{
                    res1.redirect('/');
                }
            }catch (e) {
                const flash = {
                    mess:e,
                    code: 401,
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
                code: 400,
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
        const token = cookie_mdl.getToken(req,res);

        if(typeof token !== 'undefined' ){
            res.redirect('/');
        }else{
            const public_ = await home.getPublic(res);
            const flash = cookie_mdl.getFlash(req);
            cookie_mdl.destroyFlash(res);
            if(typeof flash != 'undefined'){
                res.status(flash.code);
            }
            res.render('pages/home/home_register',{public: public_,flash : flash});
        }


    },

    //get data post and create a new user in database
    home_register_post: async (req,res) =>{

        let result;
//test the type of register
        const name_I = req.sanitize(req.body.name_I);
        let flash = {
            mess:null,
            code:null,
            //type alert-danger means red color for message
            type:null
        };
        const code = await mail_service.create_code();
        //register for entreprise
        if ( name_I == null){
            const name = req.sanitize(req.body.name_E);
            let mail = req.sanitize(req.body.mail_E);
            if(!REGEX_MAIL.test(mail)){
                mail=null;
            }
            const conf_pwd=req.sanitize(req.body.pwd_E_conf);
            const pwd = req.sanitize(req.body.pwd_E);
            if (!REGEX_PWD.test(pwd)) {
                flash.mess = "Le mot de passe n'est pas au bon format";
                flash.code = 400;
                flash.type = "alert-danger";
                cookie_mdl.setFlash(flash, res);
                res.redirect('/register');
            }
            if(mail == null || pwd == null ||  name == null ) {
                flash.mess="Erreur lors de l'inscription";
                flash.code=400;
                flash.type="alert-danger";
                cookie_mdl.setFlash(flash, res);
                res.redirect('/register');
            }else if (conf_pwd !== pwd) {
                flash.mess = "Les mots de passes ne correspondent pas";
                flash.code = 400;
                flash.type = "alert-danger";
                cookie_mdl.setFlash(flash, res);
                res.redirect('/register');
            } else{

                result = await home.register_E(name,mail,pwd,code);
                if (result[0] === undefined) {
                    try{
                        await mail_service.send_conf_mail(req,res,mail,code);
                        flash.type = "alert-success";
                        flash.code = 201;
                        flash.mess = "Bravo, votre compte a été créé avec succès, un mail de confirmation va vous être envoyé";
                        cookie_mdl.setFlash(flash, res);
                        //status 1 means that register is ok
                        res.redirect('/register/verify');
                    }catch(e){
                        flash.type = "alert-danger";
                        flash.code = 500;
                        flash.mess = e;
                        cookie_mdl.setFlash(flash, res);
                        //status 1 means that register is ok
                        res.redirect('/register/verify');
                    }
                } else {
                    flash.type="alert-danger";
                    flash.code=400;
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
            if (!REGEX_MAIL.test(mail)) {
                mail = null;
            }
            const pwd = req.sanitize(req.body.pwd_I);
            if (!REGEX_PWD.test(pwd)) {
                flash.mess = "Le mot de passe n'est pas au bon format";
                flash.code = 400;
                flash.type = "alert-danger";
                cookie_mdl.setFlash(flash, res);
                res.redirect('/register');
            }

            const conf_pwd = req.sanitize(req.body.pwd_I_conf);
            const date = req.sanitize(req.body.date_I);
            const nom_Inf = req.sanitize(req.body.nameInf);
            const public_ = req.sanitize(req.body.public_);
            if (mail == null || pwd == null || date == null || surname == null || nom_Inf == null) {
                flash.mess = "Erreur lors de l'inscription";
                flash.code = 400;
                flash.type = "alert-danger";
                cookie_mdl.setFlash(flash, res);
                res.redirect('/register');
            } else if (conf_pwd !== pwd) {
                flash.mess = "Les mots de passes ne correspondent pas";
                flash.code = 400;
                flash.type = "alert-danger";
                cookie_mdl.setFlash(flash, res);
                res.redirect('/register');
            } else {
                result = await home.register_I(name_I, surname, mail, pwd, date, nom_Inf, public_,code);
                if (result[0] === undefined) {
                    try{
                        await mail_service.send_conf_mail(req,res,mail,code);
                        flash.type = "alert-success";
                        flash.code = 201;
                        flash.mess = "Bravo, votre compte a été créé avec succès, un mail de confirmation va vous être envoyé";
                        cookie_mdl.setFlash(flash, res);
                        //status 1 means that register is ok
                        res.redirect('/register/verify');
                    }catch(e){
                        flash.type = "alert-danger";
                        flash.code = 500;
                        flash.mess = "Erreur lors de l'envoi du mail";
                        cookie_mdl.setFlash(flash, res);
                        //status 1 means that register is ok
                        res.redirect('/register/verify');
                    }

                } else {
                    flash.type = "alert-danger";
                    flash.code = 400;
                    flash.mess = "Vous avez déja un compte avec ce mail";
                    cookie_mdl.setFlash(flash, res);
                    //status 2 means that user is already in database
                    res.redirect('/register');
                }
            }
        }
    },


    //LOGOUT
    logout:(req,res)=>{
        const flash = {
            mess:"Vous avez été déconnecté",
            code:200,
            //type alert-success means green color for message
            type:"alert-success"
        };
        cookie_mdl.setFlash(flash, res);
        cookie_mdl.destroyToken(req,res);
        res.redirect('/');
    },
    //envoyer un mail grâce au formulaire de contact du footer
    send_mail_contact: async (req,res)=> {
        try{
            if (!REGEX_MAIL.test(req.body.mail) || req.body.message === '') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ status: 400 }));
                res.end();
            }else{

                await mail_service.send_mail_C(req,res);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ status: 200 }));
                res.end();
                res.writeHead(503, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ status: 503 }));
                res.end();


            }
        }catch (e) {
            const flash = {
                type: "alert-danger",
                code: 401,
                mess: e,
            };
            cookie_mdl.setFlash(flash,res);
            res.redirect('/');
        }
    },

    //page de vérification d'un compte avant inscription
    verify_get:(req,res)=> {
        const flash = cookie_mdl.getFlash(req);
        cookie_mdl.destroyFlash(res);
        res.render('pages/home/verify', {flash: flash});
    },
    //vérification du compte
    verify_put:async (req,res)=> {
        try{
            let code=req.sanitize(req.body.code);
            const mail=req.sanitize(req.body.mail);
            if(typeof code != 'undefined'){
                const verif = await home.verify_user(code);
                console.log(verif)
                if(verif){
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.write(JSON.stringify({ status: 200 }));
                    res.end();
                }else{
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.write(JSON.stringify({ status: 400 }));
                    res.end();
                }
            }else{

                if (!REGEX_MAIL.test(mail)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.write(JSON.stringify({ status: 400 }));
                    res.end();
                }else{
                    code = await home.getcode(mail);
                    await mail_service.send_conf_mail(req,res,mail,code[0].code);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.write(JSON.stringify({ status: 200 }));
                    res.end();
                }
            }


        }catch (e) {
            const flash = {
                type: "alert-danger",
                code: 401,
                mess: e,
            };
            cookie_mdl.setFlash(flash,res);
            res.redirect('/register/verify');
        }
    }
};


