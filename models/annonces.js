let connexion = require('../config/db');
const cookie_mdl = require('../models/cookie');

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


};
