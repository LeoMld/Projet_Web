let connexion = require('../config/db');
const cookie_mdl = require('../models/cookie');
const jwt = require('jsonwebtoken');

module.exports= {
    is_admin: (req,res)=>{
        return new Promise((resolve,reject)=> {
            const token = cookie_mdl.getToken(req, res);
            if (typeof token !== 'undefined') {
                jwt.verify(token, cookie_mdl.getKey(), (err, infos_Token) => {
                    if (infos_Token.type === 0){
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
    annonces_check:()=>{
        return new Promise((resolve,reject)=> {
            connexion.query('SELECT * FROM annonce WHERE  valid=?',[0],(err, result) =>{
                if(err || typeof result == 'undefined') {
                    reject("Désolé, le service est momentanément indisponible ou l'annonce n'existe pas");
                }else{
                    resolve(result);
                }
            })
        })
    },
    valid_id:(id_valid)=> {
        return new Promise((resolve,reject)=> {
            connexion.query('UPDATE annonce SET valid=? WHERE id_annonce=?',[1,id_valid],(err, result) =>{
                if(err || typeof result == 'undefined') {
                    reject("Désolé, le service est momentanément indisponible ou l'annonce n'existe pas");
                }else{
                    resolve(result);
                }
            })
        })
    }
};