let connexion = require('../config/db');
const cookie_mdl = require('../models/cookie');
const jwt = require('jsonwebtoken');

module.exports= {
    get_Annonces: (req,res)=>{
        return new Promise((resolve,reject)=> {
            connexion.query('SELECT * FROM annonce',(err, result) =>{
                if(err || typeof result == 'undefined') {
                    reject("Désolé, le service est momentanément indisponible");
                }else{
                    resolve(result);
                }
            })

        })
    },
    create_Annonce: async (titre,desc,public,req,res)=>{
        return new Promise((resolve,reject)=> {
            const token = cookie_mdl.getToken(req, res);
            if (typeof token !== 'undefined'){
                jwt.verify(token, cookie_mdl.getKey(), (err, infos_Token) => {
                    const id = infos_Token.userId;
                    console.log(titre);
                    console.log(desc);
                    console.log(public);
                    console.log(id);
                    connexion.query('INSERT INTO annonce SET titre_A=?, description_A=?,FK_id_Entreprise=?,FK_id_Public=?',[titre,desc,id,1]);
                    resolve(true);
                })
            } else {
                reject("Erreur lors de l'ajout de l'annonce");
            }

        })
    },


};
