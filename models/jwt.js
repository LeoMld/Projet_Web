const jwt = require('jsonwebtoken');
const JWT_SIGN = "azertytest549";

module.exports = {
    //generate a token
  generateToken: function (id,isAdmin) {
    return jwt.sign({
        userId: id,
        isAdmin: isAdmin
    }, JWT_SIGN,{
        expiresIn: '1h'
    })
  },

    //set a token in cookies
    setToken: function(token, res){
        return res.cookie('secureToken', token, { maxAge: 6 * 60 * 60 * 1000, httpOnly: true })
    },
    //get Token in cookies
    getToken: function (req,res) {
        var username = req.cookies['secu reToken'];
        if (username) {
            return res.send(username);
        }

        return res.send('No cookie found');
    },

    verifyToken: function (req,res, next) {
        //get the token in cookies
        const token = req.cookie['authorization'];
        //check
        if (typeof token !== 'undefined'){
            res.send('connecté');
        }else{
            res.sendStatus(403);
        }

    }
};