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
    get_infos_inf: (req,res,id)=>{
        return new Promise((resolve,reject)=> {
            connexion.query('SELECT * FROM influenceur WHERE id_Influenceur=?', [id], (err, result) => {
                if (err || typeof result == 'undefined') {
                    reject("Le service est momentanément indisponible");
                } else {
                    resolve(result);
                }
            })
        })
    },

    ad_postuler: (req,res,id_post)=> {
        return new Promise((resolve,reject)=> {
            const token = cookie_mdl.getToken(req,res);
            if (typeof token !== 'undefined') {
                jwt.verify(token, cookie_mdl.getKey(), (err, infos_Token) => {
                    if (err) {
                        reject("erreur, vous avez été déconnecté");
                    } else {
                        connexion.query('SELECT * FROM postuler WHERE FK_id_annonce=? AND FK_id_influenceur=?', [id_post,infos_Token.userId], (err, result) => {
                            if (err || typeof result == 'undefined') {
                                reject("Le service est momentanément indisponible");
                            } else {
                                if(typeof result[0] == 'undefined'){
                                    connexion.query('INSERT INTO postuler SET FK_id_annonce=?, FK_id_Influenceur=?', [id_post,infos_Token.userId], (err, result) => {
                                        if (err || typeof result == 'undefined') {
                                            reject("Le service est momentanément indisponible");
                                        } else {
                                            resolve(true);
                                        }
                                    })
                                }else{
                                    connexion.query('DELETE FROM postuler WHERE FK_id_annonce=? AND FK_id_Influenceur=?', [id_post,infos_Token.userId], (err, result) => {
                                        if (err || typeof result == 'undefined') {
                                            reject("Le service est momentanément indisponible");
                                        } else {
                                            resolve(true);
                                        }
                                    })
                                }
                            }

                        })
                    }
                })
            }else{
                reject("erreur vous avez été déconnecté");
            }
        })
    },
    a_postule:(req, res, id)=> {
        return new Promise((resolve,reject)=> {
            const token = cookie_mdl.getToken(req,res);
            if (typeof token !== 'undefined') {
                jwt.verify(token, cookie_mdl.getKey(), (err, infos_Token) => {
                    if (err) {
                        reject("erreur, vous avez été déconnecté");
                    } else {
                        connexion.query('SELECT * FROM postuler WHERE FK_id_annonce=? AND FK_id_influenceur=?', [id, infos_Token.userId], (err, result) => {
                            if (err || typeof result == 'undefined') {
                                reject("Le service est momentanément indisponible");
                            } else if(typeof result[0] != 'undefined') {
                                resolve(true);
                            }else{
                                resolve(false);
                            }
                        })
                    }
                })
            }
        });
    }
};