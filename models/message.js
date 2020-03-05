const home = require('../models/home');
const jwt = require('jsonwebtoken');
const cookie_mdl = require('../services/cookie');



module.exports= {

    getMessages:(req, res,id, id2)=> {
        return new Promise((resolve,reject)=> {
            connexion.query('SELECT * FROM converser WHERE FK_id_Entreprise=?, FK_id_Influenceur=?',[id,id2],(err, result) =>{
                if(err || typeof result == 'undefined') {
                    reject("Désolé, le service est momentanément indisponible");
                }else{
                    resolve(result);
                }
            })

        })
    },
};
