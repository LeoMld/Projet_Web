
const JWT_SIGN = "VTTz6QqH3mLpjBLGy-jkD2-rNQtpDGd5N8POjIGk2KlL8wHmqIbD6sm4MEWhZM_OfIY-6iFdsBfWnGP3MMVXMSOJTBm2C4yh9Cb-xW3HHwfpgZOHsdPNHHxZiIKbOE2U4XHlPfeCfK06NJqIHvXE9p4yGXMWYfK1PN65Yb7jo1SDtVpJn2Y1w9WVlRUM4jQqzp5f5Ef9oxaHOmPZG1Xtiw3k1Mz4Ho1YK8rTnBPBEUOmBeWKGfNe5xpYGBrknC5KZUi5ndDgFn69LHo5GiEUd6vVKbmYju1YGxs45FxcqUGS0ZjKmk2GhbEo9IjfmWoacfR01mZtBl_Dz1OjpjuKIQ" ;


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
    connect: (req,res,id,type,next)=>{
        var token = token.sign({
            userId: id,
            type: type
        }, JWT_SIGN,{
            expiresIn: '5h'
        });
        res.cookie('secureToken', token, { maxAge: 6 * 60 * 60 * 1000, httpOnly: true });
        //look if token is in cookies
        next({
            check: req.cookies['secureToken'] !== undefined,
        })
    },

};