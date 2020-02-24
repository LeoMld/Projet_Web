
const JWT_SIGN = "azertytest549" ;


module.exports = {

    getKey(){
        return JWT_SIGN;
    },

    //set a token in cookies
    setToken: (token, res)=>{
        return res.cookie('secureToken', token, { maxAge: 6 * 60 * 60 * 1000, httpOnly: true })
    },

    getToken : (req,res)=>{
        return req.cookies['secureToken'];

    },

    destroyToken: (req,res) =>{
        return res.clearCookie('secureToken');
    },

    //generate a token, put him in cookies
    connect: (req,res,id,type,next)=>{
        var token = token.sign({
            userId: id,
            type: type
        }, JWT_SIGN,{
            expiresIn: '1h'
        });
        res.cookie('secureToken', token, { maxAge: 6 * 60 * 60 * 1000, httpOnly: true });
        //look if token is in cookies
        next({
            check: req.cookies['secureToken'] !== undefined,
        })
    },

};