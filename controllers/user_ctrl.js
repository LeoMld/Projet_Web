const connected = require('../models/user');
const jwt = require('../models/jwt');

module.exports = {
    profil_get : (req,res)=>{
        res.render('pages/connected/profile');
    }

};