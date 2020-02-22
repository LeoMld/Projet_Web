
const home = require('../model/home');

exports.home_connexion_get = function (req,res) {
    res.render('home_connexion');

};

exports.home_register_get = function (req,res) {
    res.render('home_register');
};

exports.home_register_post = function (req,res) {
    home.register(req,res);
    res.send('inscription');
};

exports.home_contact_get = function (req,res) {
    res.send('contact');
};

