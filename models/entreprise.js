const cookie_mdl = require('../models/cookie');
let connexion = require('../config/db');
const jwt = require('jsonwebtoken');

module.exports = {
    is_entreprise: (req,res)=>{
        return new Promise((resolve,reject)=> {
            const token = cookie_mdl.getToken(req, res);
            if (typeof token !== 'undefined') {
                jwt.verify(token, cookie_mdl.getKey(), (err, infos_Token) => {
                    if (infos_Token.type === 2){
                        resolve(true);
                    } else {
                        reject("Erreur vous avez été déconnecté");
                    }
                })
            } else {
                reject("Erreur vous avez été déconnecté");
            }
        })
    },
    get_my_ads: (req, res)=>{
        return new Promise((resolve,reject)=> {
            const token = cookie_mdl.getToken(req,res);
            if (typeof token !== 'undefined') {
                jwt.verify(token, cookie_mdl.getKey(), (err, infos_Token) => {
                    if (err) {
                        reject(1);
                    } else {
                        connexion.query('SELECT * FROM annonce WHERE FK_id_Entreprise=?', [infos_Token.userID], (err, result) => {
                            if (err || typeof result == 'undefined') {
                                reject(2);
                            } else {
                                resolve(result);
                            }
                        })
                    }
                })
            }else{
                reject(1);
            }
        })
    },
};