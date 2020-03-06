let connexion = require('../config/db');
const cookie_mdl = require('../services/cookie');
const jwt = require('jsonwebtoken');

module.exports= {
    //verifie gràace au token dans les cookies si le type du token est bien admin
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
    //return les annonces qui n'ont pas encore été validées
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
    //valide une annonce grâce a l'id de celle ci passé en paramètre
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
    },
    //supprimer une annonce à partir d'un id
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
    //supprime un avis grâce à l'id de l'avis passé en paramètre
    delete_avis:(id_delete)=> {
        return new Promise((resolve,reject)=> {
            connexion.query('DELETE FROM avis WHERE id_avis=?',[id_delete],(err, result) =>{
                if(err || typeof result == 'undefined') {
                    reject("Désolé, le service est momentanément indisponible ou l'annonce n'existe pas");
                }else{
                    resolve(result);
                }
            })
        })
    },
    //supprime une annonce grâce à l'id passé en paramètre
    delete_ad:(id_delete)=> {
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
    //supprime une entreprise grâce à l'id passé en paramètre
    delete_ent(id_delete) {
        return new Promise((resolve,reject)=> {
            connexion.query('DELETE FROM entreprise WHERE id_Entreprise=?',[id_delete],(err, result) =>{
                if(err || typeof result == 'undefined') {
                    reject("Désolé, le service est momentanément indisponible");
                }else{
                    resolve(result);
                }
            })
        })
    },
    //supprime un influenceur grâce à l'id passé en paramètre
    delete_inf(id_delete) {
        return new Promise((resolve,reject)=> {
            connexion.query('DELETE FROM influenceur WHERE id_Influenceur=?',[id_delete],(err, result) =>{
                if(err || typeof result == 'undefined') {
                    reject("Désolé, le service est momentanément indisponible");
                }else{
                    resolve(result);
                }
            })
        })
    }
};