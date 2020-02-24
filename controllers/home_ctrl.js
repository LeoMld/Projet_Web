const home = require('../models/home');
const jwt = require('jsonwebtoken');
//const sanitizer = require('express-sanitizer');
const cookie_mdl = require('../models/cookie');



module.exports= {
    //STATUS VAR
    //status_co use: 0 means wrong mail or password, 1 means normal access to connexion page

    home_connexion_get: function(req,res) {
        //verify if a token is already in cookies
        const token = cookie_mdl.getToken(req,res);
        if(typeof token !== 'undefined'){
            jwt.verify(token, cookie_mdl.getKey(), (err, infos_Token)=> {
                if (err) {
                    cookie_mdl.destroyToken(req,res);
                    res.redirect('/');
                } else {
                    if(infos_Token.type == 0){
                        res.redirect('/admin');
                    }else if (infos_Token.type == 1){
                        res.redirect('/influenceur');
                    }else{
                        res.redirect('/entreprise');
                    }
                }
            })

        }else{
            res.render('pages/home/home_connexion',{status_co:1});
        }

    },

    home_connexion_post: async (req,res1)=>{
        //post connexion
        const mail = req.sanitize(req.body.mail);
        const pwd = req.sanitize(req.body.pwd);
        console.log(mail);

        const result= await home.connect(req,res1,mail,pwd);
        if(result == 0){
            res1.render('pages/home/home_connexion',{status_co:0});
        }else{
            res1.redirect('/');
        }
        //if there is no mail or password err status 500

        },



    //REGISTER PAGE CONTROLLERS
    home_register_get: async (req,res) =>{
        const public_ = await home.getPublic(res);
        console.log(public_);
        //status 0 means normal access to register page
        res.render('pages/home/home_register',{status_reg: 0, public: public_});

    },

    //get data post and create a new user in database
    home_register_post: (req,res) =>{
        //test the type of register
        const name_I = req.sanitize(req.body.name_I);
        //register for entreprise
        if ( name_I == null){
            const name = req.sanitize(req.body.name_E);
            const mail = req.sanitize(req.body.mail_E);
            const pwd = req.sanitize(req.body.pwd_E);

            if(mail == null || pwd == null ||  name == null ) {
                return res.status(400).json({'error': 'missing parameters'});
            }
            home.register_E(name,mail,pwd).then((result)=>{
                if(result[0] === undefined){
                    //status 1 means that register is ok
                    res.render('pages/home/home_register',{status_reg: 1});
                }else{
                    //status 2 means that user is already in database
                    res.render('pages/home/home_register',{status_reg: 2});
                }
            })

        }else {
            //register for influenceur
            const surname = req.sanitize(req.body.surname_I);
            const mail = req.sanitize(req.body.mail_I);
            const pwd = req.sanitize(req.body.pwd_I);
            const date = req.sanitize(req.body.date_I);
            const nom_Inf = req.sanitize(req.body.nameInf);
            if (mail == null || pwd == null || date == null || surname == null || nom_Inf == null) {
                return res.status(400).json({'error': 'missing parameters'});
            }
            home.register_I(name_I,surname,mail,pwd,date,nom_Inf).then((result) => {
                if (result[0] === undefined) {
                    //status 1 means that register is ok
                    res.render('pages/home/home_register', {status_reg: 1});
                } else {
                    //status 2 means that user is already in database
                    res.render('pages/home/home_register', {status_reg: 2});
                }

            })
        }

    },

    home_contact_get:  (req,res)=> {
        res.send('contact');
    },

    //LOGOUT
    logout:(req,res)=>{
        cookie_mdl.destroyToken(req,res);
        res.redirect('/');
    }
};


