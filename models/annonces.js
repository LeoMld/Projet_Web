let connexion = require('../config/db');
const cookie_mdl = require('../models/cookie');
const jwt = require('jsonwebtoken');

module.exports= {
    get_Annonces: ()=>{
        return new Promise((resolve,reject)=> {
            connexion.query('SELECT * FROM annonce WHERE valid=?',[1],(err, result) =>{
                if(err || typeof result == 'undefined') {
                    reject("Désolé, le service est momentanément indisponible");
                }else{
                    resolve(result);
                }
            })

        })
    },
    get_Annonce: (req,res,id)=>{
        return new Promise((resolve,reject)=> {
            connexion.query('SELECT * FROM annonce WHERE id_annonce=? AND valid=?',[id,1],(err, result) =>{
                if(err || typeof result == 'undefined') {
                    reject("Désolé, le service est momentanément indisponible ou l'annonce n'existe pas");
                }else{
                    resolve(result);
                }
            })
        })
    },
    create_Annonce: async (titre,desc,public_,cat,req,res)=>{
        return new Promise((resolve,reject)=> {
            const token = cookie_mdl.getToken(req, res);
            if (typeof token !== 'undefined'){
                jwt.verify(token, cookie_mdl.getKey(), (err, infos_Token) => {
                    const id = infos_Token.userId;
                    connexion.query('INSERT INTO annonce SET titre_A=?, description_A=?,FK_id_Entreprise=?,FK_id_Public=?,FK_id_Categorie=?',[titre,desc,id,public_,cat],(err,result) => {
                        if (err || typeof result == 'undefined') {
                            reject("Désolé, le service est momentanément indisponible");
                        } else {
                            resolve(true);
                        }
                    })
                })
            } else {
                reject("Erreur lors de l'ajout de l'annonce");
            }

        })
    },


    get_Avis:(req, res, idA,idE)=> {
        return new Promise((resolve,reject)=> {
            connexion.query('SELECT * FROM avis WHERE FK_id_Annonce=? AND FK_id_Entreprise=?',[idA,idE],(err, result) =>{
                if(err || typeof result == 'undefined') {
                    reject("Désolé, le service est momentanément indisponible ou l'annonce n'existe pas");
                }else{
                    resolve(result);
                }
            })
        })
    }
};
