const bcrypt = require('bcrypt');
const jwt = require('../models/jwt');
const home = require('../models/home');

module.exports= {
    home_connexion_get : function(req,res) {
        res.render('pages/home_connexion');

    },
    home_connexion_post: (req,res) => {
        var token  = jwt.generateToken(2,3);
        jwt.setToken(token,res);
        jwt.getToken(req,res);
        //res.render('pages/home_connexion');

    },

    home_register_get: function(req,res) {
        res.render('pages/home_register');
    },

    home_register_post: function(req,res) {
        var mail = req.body.mail;
        var pwd = req.body.pwd;
        if(mail == null || pwd == null ) {
            return res.status(400).json({'error': 'missing parameters'});
        }
        home.register(mail,pwd);
        res.send('inscription réussie');
    },

    home_contact_get: function (req,res) {
        res.send('contact');
    }
};


