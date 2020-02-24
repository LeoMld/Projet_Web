const influenceur = require('../models/influenceur');
const cookie_mdl = require('../models/cookie');
const jwt = require('jsonwebtoken');



module.exports= {
    profil_get: (req,res)=>{
        const token = cookie_mdl.getToken(req,res);
        if(typeof token !== 'undefined'){
            jwt.verify(token, cookie_mdl.getKey(), (err, infos_Token)=> {
                if(infos_Token.type == 2){
                    res.render('pages/entreprise/profil');
                }else{
                    res.redirect('/');
                }

            })
        }else{
            res.redirect('/');
        }
    },
    ent_get: (req,res)=> {
        res.redirect('/entreprise/profil')
    },
};