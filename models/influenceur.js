const cookie_mdl = require('../models/cookie');
const jwt = require('jsonwebtoken');
let connexion = require('../config/db');

module.exports = {
    is_influenceur:(req,res)=>{
        return new Promise((resolve,reject)=> {
            const token = cookie_mdl.getToken(req, res);
            if (typeof token !== 'undefined') {
                jwt.verify(token, cookie_mdl.getKey(), (err, infos_Token) => {
                    if (infos_Token.type === 1){
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
    get_influenceurs:()=>{
        return new Promise((resolve,reject)=> {
            connexion.query('SELECT * FROM influenceur', (err, result) => {
                if (err || typeof result == 'undefined') {
                    reject("Le service est momentanément indisponible");
                } else {
                    resolve(result);
                }
            })
        })
    },
    get_infos: (req,res)=>{
        return new Promise((resolve,reject)=> {
            const token = cookie_mdl.getToken(req,res);
            if (typeof token !== 'undefined') {
                jwt.verify(token, cookie_mdl.getKey(), (err, infos_Token) => {
                    if (err) {
                        reject("erreur, vous avez été déconnecté");
                    } else {
                        connexion.query('SELECT * FROM influenceur WHERE id_Influenceur=?', [infos_Token.userId], (err, result) => {
                            if (err || typeof result == 'undefined') {
                                reject("Le service est momentanément indisponible");
                            } else {
                                resolve(result);
                            }
                        })
                    }
                })
            }else{
                reject("erreur vous avez été déconnecté");
            }
        })
    },
    profil_inf_put:(nom,mail,prenom,date,public_,nom_Inf,id)=> {
        console.log(nom,mail,prenom,date,public_,nom_Inf,id)
        return new Promise((resolve,reject)=> {
            connexion.query('UPDATE influenceur SET nom_I=?, mail_I=?, prenom_I=?,date_naissance_I=?,FK_id_Public=?, nom_Inf=? WHERE id_Influenceur=?',[nom,mail,prenom,date,public_,nom_Inf,id],(err, result) =>{
                if(err || typeof result == 'undefined') {
                    reject("Désolé, le service est momentanément indisponible");
                }else{
                    resolve(true);
                }
            })
        })
    },

};