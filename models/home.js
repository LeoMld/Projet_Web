let connexion = require('./db');



module.exports = {
    register: (req,res) => {
        connexion.query('INSERT INTO influenceur SET mail_I=?,pwd_I=?',[req.body.mail,req.body.pwd]);
    },

    connexion: (req,res) =>{

    }
};



