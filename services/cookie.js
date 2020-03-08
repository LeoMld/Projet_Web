const JWT_SIGN = process.env.JWT_SIGN ;

module.exports = {

    getKey(){
        return JWT_SIGN;
    },
    setFlash: (flash,res)=>{
        return res.cookie('flash',flash,{ maxAge: 6 * 60 * 60 * 1000, httpOnly: true })
    },
    getFlash:(req)=>{
        return req.cookies['flash'];
    },
    destroyFlash:(res)=>{
        return res.clearCookie('flash');

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
    connect: (req,res,id,type)=>{
        const token = token.sign({
            userId: id,
            type: type
        }, JWT_SIGN, {
            expiresIn: '5h'
        });
        res.cookie('secureToken', token, { maxAge: 6 * 60 * 60 * 1000, httpOnly: true });
        //look if token is in cookies

    },

};