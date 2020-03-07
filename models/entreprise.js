const cookie_mdl = require('../services/cookie');
let connexion = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


module.exports = {
    //va voir dans les cookies si le token correspond bien à une entreprise
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
    //retourne les annonces liées au compte entreprise connecté
    get_my_ads: (req, res)=>{
        return new Promise((resolve,reject)=> {
            const token = cookie_mdl.getToken(req,res);
            if (typeof token !== 'undefined') {
                jwt.verify(token, cookie_mdl.getKey(), (err, infos_Token) => {
                    if (err) {
                        reject(1);
                    } else {
                        connexion.query('SELECT * FROM annonce WHERE FK_id_Entreprise=?', [infos_Token.userId], (err1, result) => {
                            if (err1 || typeof result == 'undefined') {
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
    //retourne les informations liées au compte entreprise connecté
    get_infos: (req,res)=>{
        return new Promise((resolve,reject)=> {
            const token = cookie_mdl.getToken(req,res);
            if (typeof token !== 'undefined') {
                jwt.verify(token, cookie_mdl.getKey(), (err, infos_Token) => {
                    if (err) {
                        reject("erreur, vous avez été déconnecté");
                    } else {
                        connexion.query('SELECT * FROM entreprise WHERE id_Entreprise=?', [infos_Token.userId], (err1, result) => {
                            if (err1 || typeof result[0] == 'undefined') {
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
    //retourne les infos liées à une entreprise passé en paramètre
    get_infos_ent: (req,res)=> {
        return new Promise((resolve, reject) => {
            connexion.query('SELECT * FROM entreprise WHERE id_Entreprise=?', [req.params.id], (err1, result) => {
                if (err1 || typeof result[0] == 'undefined') {
                    reject("Le service est momentanément indisponible");
                } else {
                    resolve(result);
                }
            })

        })
    },
    //retroune toutes les entreprises
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
    //retourne les annonces liés à l'entreprise
    is_my_ad: (req, res) => {
        return new Promise((resolve,reject)=> {
            const token = cookie_mdl.getToken(req,res);
            if (typeof token !== 'undefined') {
                jwt.verify(token, cookie_mdl.getKey(), (err, infos_Token) => {
                    if (err) {
                        reject("erreur, vous avez été déconnecté");
                    } else {
                        connexion.query('SELECT * FROM annonce WHERE id_annonce=? AND FK_id_Entreprise=?', [req.params.id, infos_Token.userId], (err1, result) => {
                            if (err1 || typeof result[0] == 'undefined') {
                                reject("Ce n'est pas votre annonce");
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
    //supprime une annonce grâce à l'id de l'annonce
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
    //modifie une annonce
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
    //modifie son profil
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
    },
    //vérifie si le mot de passe passé en paramètre correspond au mot de passe du compte
    mdp_ok:(req, res, userId, ancien_pwd)=> {
        return new Promise((resolve, reject) => {
            connexion.query('SELECT pwd_E FROM entreprise WHERE id_Entreprise=?', [userId], (err, res1) => {
                if (err) {
                    reject("erreur lors du changement de mot de passe");
                } else {
                    bcrypt.compare(ancien_pwd, res1[0].pwd_E, function (err1, result) {
                        if(err1){
                            resolve(false);
                        }
                        else if (result) {
                            resolve(true);
                        } else {
                            resolve(false)
                        }

                    })
                }

            })
        })
    },
    //modifie le mot de passe de l'entreprise par le mot de passe passé en paramètre
    modify_mdp:(req, res, idUser, new_pwd)=> {
        bcrypt.hash(new_pwd, 10, function(err, hash) {
            return new Promise((resolve, reject) => {
                connexion.query('UPDATE entreprise SET pwd_E=? WHERE id_Entreprise=?', [hash, idUser], (err1) => {
                    if (err1) {
                        reject("erreur lors du changement de mot de passe");
                    } else {
                        resolve(true);
                    }

                })
            })
        })
    }
};