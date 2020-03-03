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
                        connexion.query('SELECT * FROM annonce WHERE FK_id_Entreprise=?', [infos_Token.userId], (err, result) => {
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
    get_infos: (req,res)=>{
        return new Promise((resolve,reject)=> {
            const token = cookie_mdl.getToken(req,res);
            if (typeof token !== 'undefined') {
                jwt.verify(token, cookie_mdl.getKey(), (err, infos_Token) => {
                    if (err) {
                        reject("erreur, vous avez été déconnecté");
                    } else {
                        connexion.query('SELECT * FROM entreprise WHERE id_Entreprise=?', [infos_Token.userId], (err, result) => {
                            if (err || typeof result[0] == 'undefined') {
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
    get_infos_inf: (req,res)=> {
        return new Promise((resolve, reject) => {
            connexion.query('SELECT * FROM entreprise WHERE id_Entreprise=?', [req.params.id], (err, result) => {
                if (err || typeof result[0] == 'undefined') {
                    reject("Le service est momentanément indisponible");
                } else {
                    resolve(result);
                }
            })

        })
    },
    get_entreprises:()=>{
        return new Promise((resolve, reject )=> {
            connexion.query('SELECT * FROM entreprise ',(err,res)=>{
                if(err){
                    reject("Désolé, le service est momentanément indisponible");
                }else{
                    resolve(res);
                }
            });
        })
    },

    is_my_ad: (req, res) => {
        return new Promise((resolve,reject)=> {
            const token = cookie_mdl.getToken(req,res);
            if (typeof token !== 'undefined') {
                jwt.verify(token, cookie_mdl.getKey(), (err, infos_Token) => {
                    if (err) {
                        reject("erreur, vous avez été déconnecté");
                    } else {
                        connexion.query('SELECT * FROM annonce WHERE id_annonce=? AND FK_id_Entreprise=?', [req.params.id, infos_Token.userId], (err, result) => {
                            if (err || typeof result[0] == 'undefined') {
                                reject("Ce n'est pas votre annonce");
                            } else {
                                console.log('sqkdklqhdlqkj')
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
    delete_id: (id_delete) =>{
        return new Promise((resolve,reject)=> {
            connexion.query('DELETE FROM annonce WHERE id_annonce=?',[id_delete],(err, result) =>{
                if(err || typeof result == 'undefined') {
                    reject("Désolé, le service est momentanément indisponible ou l'annonce n'existe pas");
                }else{
                    resolve(result);
                }
            })
        })
    },
    my_ad_put: (id_annonce, titre_annonce,desc_annonce,public_annonce,cat_annonce)=>{
        return new Promise((resolve,reject)=> {
            connexion.query('UPDATE annonce SET titre_A=?, description_A=?, FK_id_Public=?, FK_id_Categorie=?, valid=? WHERE id_annonce=?',[ titre_annonce,desc_annonce,public_annonce,cat_annonce,0,id_annonce],(err, result) =>{
                if(err || typeof result == 'undefined') {
                    reject("Désolé, le service est momentanément indisponible ou l'annonce n'existe pas");
                }else{
                    resolve(result);
                }
            })
        })
    },

    profil_put:(nom, mail, tel, desc,url,id)=> {
        return new Promise((resolve,reject)=> {
            connexion.query('UPDATE entreprise SET nom_E=?, mail_E=?,tel_E=?, desc_E=?,site_web=? WHERE id_Entreprise=?',[ nom, mail, tel, desc,url,id],(err, result) =>{
                if(err || typeof result == 'undefined') {
                    reject("Désolé, le service est momentanément indisponible");
                }else{
                    resolve(result);
                }
            })
        })
    }
};