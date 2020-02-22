let connexion = require('./db');

let register = function (req,res) {
    connexion.query('INSERT INTO influenceur SET mail_I=?,pwd_I=?',[req.body.mail,req.body.pwd]);
};

exports.register = register;