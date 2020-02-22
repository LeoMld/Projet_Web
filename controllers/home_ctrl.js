const bcrypt = require('bcrypt');
const home = require('../models/home');

module.exports= {
    home_connexion_get : function(req,res) {
        res.render('pages/home_connexion');

    },

    home_connexion_post: (req,res) => {
        const mail = req.body.mail;
        const pwd = req.body.pwd;
        if(mail !== undefined && pwd !== undefined){
            home.connexion(mail,pwd).then((result)=>{
                res.sendStatus(200);
                console.log(result);
            }).catch((err) => {
                res.sendStatus(500);
            })
        }else{
            res.status(500).send("missing data");
        }

        //res.render('pages/home_connexion');

    },

    home_register_get: (req,res) =>{
        res.render('pages/home_register');
    },

    home_register_post: (req,res) =>{
        const name = req.body.name_I;
        const surname = req.body.surname_I;
        const mail = req.body.mail_I;
        const pwd = req.body.pwd_I;
        const date = req.body.date_I;
        const  nom_Inf = req.body.nom_Inf;
        if(mail == null || pwd == null || date == null || surname == null ||  name == null || nom_Inf == null ) {
            return res.status(400).json({'error': 'missing parameters'});
        }
        home.register_I(name,surname,mail,pwd,date,nom_Inf);
        res.send('inscription réussie');
    },

    home_contact_get:  (req,res)=> {
        res.send('contact');
    }
};


