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
    setToken: (token, res)=>{
        return res.cookie('secureToken', token, { maxAge: 6 * 60 * 60 * 1000, httpOnly: true });
    },
    //get Token in cookies
    getToken: (req,res) => {
        var token = req.cookies['secureToken'];
        if (!token) {
            res.sendStatus(403);
        }
        return token;


    },
    destroyToken: (req,res) =>{
        res.clearCookie('secureToken');
    },


    //return true is the token is in cookies
    verifyToken: function (req,res) {
        //get the token in cookies
        const token = req.cookies['secureToken'];
        //check
        return token !== undefined;

    }
};