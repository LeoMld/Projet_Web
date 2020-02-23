const home = require('../models/home');
const jwt = require('../models/jwt');

module.exports= {
    //STATUS VAR
    //status_co use: 0 means wrong mail or password, 1 means normal access to connexion page

    home_connexion_get : function(req,res) {
        //verify if a token is already in cookies
        if(jwt.verifyToken(req,res)){
            //res.redirect('/3/profile');
            //jwt.destroyToken(req,res);

            res.redirect('/3/profile');
            //res.render('pages/home/home_connexion',{status_co:1});
        }else {
            res.render('pages/home/home_connexion',{status_co:1});
        }
    },

    home_connexion_post: (req,res) => {
        //post connexion

        const mail = req.body.mail;
        const pwd = req.body.pwd;
        //if there is no mail or password err status 500
        if(mail !== undefined && pwd !== undefined){
            //connexion will compare mail, pwd in database and return user data if he is in database
            home.connexion(mail,pwd).then((result)=>{
                if(result[0] === undefined){
                    res.render('pages/home/home_connexion',{status_co:0});
                    console.log('redirection mauvais mot de passe');
                }else{
                    //if user is in database, we can generate the token
                    //put in the token id, if it's an admin
                    const id = result[0].id_Influenceur;
                    const is_admin = result[0].admin;
                    const token = jwt.generateToken(id,is_admin);
                    jwt.setToken(token ,(err, res) =>{
                        if(res){
                            jwt.verifyToken(req,res => {
                                if(res){
                                    res.render('pages/connected/profile');
                                }else{
                                    res.status(404).send("token not found");
                                }
                            })
                        }else{
                            res.status(404).send("token not found");
                        }
                    })
                }


            }).catch((err) => {

                console.log(err);
            })
        }else{
            res.status(500).send("missing data");
        }

        //res.render('pages/home_connexion');

    },

    //REGISTER PAGE CONTROLLERS
    home_register_get: (req,res) =>{
        //status 0 means normal access to register page
        res.render('pages/home/home_register',{status_reg: 0});

    },

    //get data post and create a new user in database
    home_register_post: (req,res) =>{
        //test the type of register
        const name_I = req.body.name_I;
        //register for entreprise
        if ( name_I == null){
            const name = req.body.name_E;
            const mail = req.body.mail_E;
            const pwd = req.body.pwd_E;
            if(mail == null || pwd == null ||  name == null ) {
                return res.status(400).json({'error': 'missing parameters'});
            }
            home.register_E(name,mail,pwd).then((result)=>{
                if(result[0] === undefined){
                    //status 1 means that register is ok
                    res.render('pages/home/home_register',{status_reg: 1});
                }else{
                    //status 2 means that user is already in database
                    res.render('pages/home/home_register',{status_reg: 2});
                }



            })

        }else {
            //register for influenceur
            const surname = req.body.surname_I;
            const mail = req.body.mail_I;
            const pwd = req.body.pwd_I;
            const date = req.body.date_I;
            const nom_Inf = req.body.nameInf;
            if (mail == null || pwd == null || date == null || surname == null || name_I == null || nom_Inf == null) {
                return res.status(400).json({'error': 'missing parameters'});
            }
            home.register_I(name_I,surname,mail,pwd,date,nom_Inf).then((result) => {
                if (result[0] === undefined) {
                    //status 1 means that register is ok
                    res.render('pages/home/home_register', {status_reg: 1});
                } else {
                    //status 2 means that user is already in database
                    res.render('pages/home/home_register', {status_reg: 2});
                }


            })
        }

    },

    home_contact_get:  (req,res)=> {
        res.send('contact');
    }
};


