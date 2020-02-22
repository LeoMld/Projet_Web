let connexion = require('./db');

let register = function (req,res) {
    connexion.query('INSERT INTO influenceur SET mail_I=?,pwd_I=?',[req.body.mail,req.body.pwd]);
};

function ignoreFavicon(req, res, next) {
    if (req.originalUrl === '/favicon.ico') {
        res.status(204).json({nope: true});
    } else {
        next();
    }
}

exports.register = register;
exports.ignoreFavicon = ignoreFavicon;