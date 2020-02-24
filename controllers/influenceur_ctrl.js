const influenceur = require('../models/influenceur');
const cookie_mdl = require('../models/cookie');
const jwt = require('jsonwebtoken');

module.exports= {
    profil_get: (req,res)=>{
        const token = cookie_mdl.getToken(req,res);
        if(typeof token !== 'undefined'){
            jwt.verify(token, cookie_mdl.getKey(), (err, infos_Token)=> {
                if(infos_Token.type == 1){
                    res.render('pages/influenceur/profil');
                }else{
                    res.redirect('/');
                }

            })
        }else{
            res.redirect('/');
        }


    },


    inf_get: (req,res)=> {
        res.redirect('/influenceur/profil')
    },
};