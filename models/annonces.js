let connexion = require('../config/db');
const cookie_mdl = require('../services/cookie');
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
    //récupérer une annonce grâce à son id sans discerner si elle a été validée ou non ( utile pour qu'un admin visualise l'annonce avant de la valider)
    get_Annonce_all:(req,res,id)=>{
        return new Promise((resolve,reject)=> {
            connexion.query('SELECT * FROM annonce WHERE id_annonce=? ',[id],(err, result) =>{
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


    get_Avis:(req, res, idA)=> {

        return new Promise((resolve,reject)=> {
            connexion.query('SELECT * FROM avis WHERE FK_id_Annonce=? ORDER BY date_A DESC ',[idA],(err, result) =>{
                if(err || typeof result == 'undefined') {
                    reject("Désolé, le service est momentanément indisponible ou l'annonce n'existe pas");
                }else{
                    resolve(result);
                }
            })
        })
    },
    create_Avis:(req,res,note,desc,idA)=> {
        return new Promise((resolve,reject)=> {
            const token = cookie_mdl.getToken(req, res);
            if (typeof token !== 'undefined'){
                jwt.verify(token, cookie_mdl.getKey(), (err, infos_Token) => {
                    const id = infos_Token.userId;
                    connexion.query('INSERT INTO avis SET note_A=?, desc_A=?,FK_id_Annonce=?,FK_id_Influenceur=?',[note,desc,idA,id],(err,result) => {
                        if (err || typeof result == 'undefined') {
                            reject("Désolé, le service est momentanément indisponible");
                        } else {
                            resolve(true);
                        }
                    })
                })
            } else {
                reject("Erreur lors de l'ajout de l'avis");
            }

        })
    },
    get_moyenne: (avis)=> {
        if(typeof avis[0] != 'undefined'){
            let somme=0;
            for (let i = 0; i < avis.length; i++){
                somme += avis[i].note_A;
            }
            return somme;

        }else{
            return null;
        }
    },
    nb_Avis:(req,res)=> {
        return new Promise((resolve,reject)=> {
            const token = cookie_mdl.getToken(req, res);
            if (typeof token !== 'undefined'){
                jwt.verify(token, cookie_mdl.getKey(), (err, infos_Token) => {
                    const id = infos_Token.userId;
                    connexion.query('SELECT * FROM avis WHERE FK_id_Influenceur=? AND FK_id_Annonce=?',[id,req.params.id],(err,result) => {
                        if (err || typeof result == 'undefined') {
                            reject("Désolé, le service est momentanément indisponible");
                        } else {
                            if(typeof result[0] == 'undefined'){
                                resolve(0);
                            }else{
                                resolve(1);
                            }

                        }
                    })
                })
            } else {
                reject("Erreur vous n'êtes pas connecté");
            }

        })
    },
    get_influenceurs_interet:(req, res)=> {
        return new Promise((resolve,reject)=> {
            const token = cookie_mdl.getToken(req, res);
            if (typeof token !== 'undefined'){
                jwt.verify(token, cookie_mdl.getKey(), (err, infos_Token) => {
                    const idE = infos_Token.userId;
                    const idA = req.params.id;
                    connexion.query('SELECT * FROM influenceur LEFT JOIN postuler ON influenceur.id_influenceur = postuler.FK_id_influenceur INNER JOIN annonce ON postuler.FK_id_annonce=annonce.id_annonce WHERE annonce.FK_id_entreprise=? AND annonce.id_annonce=? AND annonce.valid=?',[idE,idA,1],(err,result) => {
                        if (err || typeof result == 'undefined') {
                            reject("Désolé, le service est momentanément indisponible");
                        } else {
                            resolve(result);
                        }
                    })
                })
            } else {
                reject("Erreur vous n'êtes pas connecté");
            }

        })
    }
};
