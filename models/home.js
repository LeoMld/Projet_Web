let connexion = require('./db');



module.exports = {
    register_I: (name,surname,mail,pwd,date,nom_Inf) => {
        connexion.query('INSERT INTO influenceur SET nom_I=?, prenom_I=?, date_naissance_I=?, nom_Inf=?,mail_I=?,pwd_I=?',[name,surname,date,nom_Inf,mail,pwd]);
    },

    connexion: (mail, pwd) => new Promise((resolve,reject) => {

        connexion.query('SELECT * FROM Influenceur WHERE mail_I=? AND pwd_I=?',[mail,pwd], (err, res) =>{
            if(err){
                reject(err);
            }else{
                resolve(res);
            }
            // error will be an Error if one occurred during the query
            // results will contain the results of the query
            // fields will contain information about the returned results fields (if any)
        });
        /*var token  = jwt.generateToken(2,3);
        jwt.setToken(token,res);
        jwt.getToken(req,res);*/
    })
};



