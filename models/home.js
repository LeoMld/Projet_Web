const cookie_mdl = require('../services/cookie');
let connexion = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');


module.exports = {
    connect: async (req,res1,mail,pwd) =>{
      return new Promise((resolve,reject)=>{
          if(mail !== undefined && pwd !== undefined){
              //connexion will compare mail, pwd in database and return user data if he is in database
              connexion.query('SELECT * FROM Influenceur WHERE mail_I=?',[mail], (err, res) =>{
                  if(err){
                      reject("Le service est indisponible");
                  }else if(res[0] === undefined){
                      //if there is nothing in influenceur table go search in entreprise table
                      connexion.query('SELECT * FROM entreprise WHERE mail_E=?',[mail], (err, res) => {
                          if (err) {
                              reject("Le service est indisponible");
                          } else{

                              if(res[0] !== undefined){
                                  //check if it's the good password and send user data or an empty table if it's the wrong password
                                  bcrypt.compare(pwd, res[0].pwd_E, function(err, result) {
                                      if(result){
                                          if(res[0].verify){
                                              //generate a token with type 2 (entreprise)
                                              const token = jwt.sign({userId: res[0].id_Entreprise, type: 2}, cookie_mdl.getKey(),{expiresIn: '1h'},);
                                              cookie_mdl.setToken(token,res1);
                                              resolve(1);
                                          }else{
                                              //profil non vérifié
                                              resolve(2);
                                          }

                                      }else {
                                          resolve(0);
                                      }
                                  });
                              }else{
                                  resolve(0);
                              }
                          }
                      });
                  } else{
                      //if there is an influenceur in db who matches
                      //check if it's the good password and send user data or an empty table if it's the wrong password
                      bcrypt.compare(pwd, res[0].pwd_I, function(err, result) {
                          if(result){
                              let token;
                              if(res[0].admin===1){
                                  //generate a token with type 0 (admin)
                                  token = jwt.sign({userId: res[0].id_Influenceur, type: 0}, cookie_mdl.getKey(),{expiresIn: '1h'},);
                                  cookie_mdl.setToken(token,res1);
                                  resolve(1);
                              }else{
                                  if(res[0].verify){
                                      ////generate a token with type 1 (influenceur)
                                      token = jwt.sign({userId: res[0].id_Influenceur, type: 1}, cookie_mdl.getKey(),{expiresIn: '1h'},);
                                      cookie_mdl.setToken(token,res1);
                                      resolve(1);
                                  }else{
                                      resolve(2);
                                  }

                              }


                          }else {
                              resolve(0);
                          }
                      });
                  }
              })
          }else{
              res1.status(500).send("missing data");
          }
      })
    },
    //insert a new user(influenceur) in database
    register_I: (name,surname,mail,pwd,date,nom_Inf,public_,code) => new Promise((resolve,reject) =>{
        //hash the password
        bcrypt.hash(pwd, 10, function(err, hash) {
            //First, search in influenceur table if there is already an user who has the same email
            connexion.query('SELECT mail_I FROM influenceur WHERE mail_I=? ',[mail], (err, res) =>{
                if(err){
                    reject(err);
                    //if there is nothing in influenceur table, let's search in entreprise table
                }else if (res[0]===undefined){
                    console.log(res);
                    connexion.query('SELECT mail_E FROM entreprise WHERE mail_E=? ',[mail], (err, res) =>{
                        if(err) {
                            reject(err);
                        }else{
                            //if there is also nothing in entreprise table we can insert, this user is not already in database
                            if(res[0] === undefined){
                                connexion.query('INSERT INTO influenceur SET nom_I=?, prenom_I=?, date_naissance_I=?, nom_Inf=?,FK_id_Public=?,mail_I=?,pwd_I=?,code=?',[surname,name,date,nom_Inf,public_,mail,hash,code]);
                                resolve(res);
                            }else{
                                console.log("erreur, l'utilisateur est deja dans la bdd ");
                                resolve(res);
                            }
                        }
                    })
                    //else we can send the res who will be an empty table []
                }else {
                    console.log("erreur, l'utilisateur est deja dans la bdd ");
                    resolve(res);
                }
            });
        });



    }),

    //register an Entreprise in database, same thing than register_I for an Entreprise
    register_E: (name, mail, pwd, code)=> new Promise((resolve,reject) => {
        bcrypt.hash(pwd, 10, function(err, hash) {
            //First, search in influenceur table
            connexion.query('SELECT mail_I FROM influenceur WHERE mail_I=? ',[mail], (err, res) =>{
                if(err){
                    reject(err);
                    //if there is nothing in influenceur table, let's search in entreprise table
                }else if (res[0]===undefined){
                    connexion.query('SELECT mail_E FROM entreprise WHERE mail_E=? ',[mail], (err, res) =>{
                        if(err) {
                            reject(err);
                        }else{
                            //if there is also nothing in entreprise table we can insert, this user is not already in database
                            if(res[0] === undefined){
                                connexion.query('INSERT INTO entreprise SET nom_E=?, mail_E=?,pwd_E=?,code=?',[name,mail,hash,code]);
                                resolve(res);
                            }else{
                                console.log("erreur, l'utilisateur est deja dans la bdd ");
                                resolve(res);
                            }
                        }
                    })
                }else {
                    console.log("erreur, l'utilisateur est deja dans la bdd ");
                    resolve(res);
                }
            });
        });
    }),


    getPublic: ()=> {
        return new Promise((resolve, reject )=> {
            connexion.query('SELECT type_P FROM public ',(err,res)=>{
                if(err){
                    reject("Désolé, le service est momentanément indisponible");
                }else{
                    resolve(res);
                }
            });
        })


    },
    getCat: ()=> {
        return new Promise((resolve, reject )=> {
            connexion.query('SELECT description_C FROM categorie ',(err,res)=>{
                if(err){
                    reject("Désolé, le service est momentanément indisponible");
                }else{
                    resolve(res);
                }
            });
        })
    },

    verify_user:(code)=> {
        return new Promise((resolve,reject)=> {
            connexion.query('UPDATE influenceur SET verify=? WHERE code=?',[1,code],(err, result) =>{
                if(err || typeof result == 'undefined') {
                    reject("Désolé, le service est momentanément indisponible");
                }else{
                    if(result.affectedRows > 0){
                        resolve(true);
                    }else{
                        connexion.query('UPDATE entreprise SET verify=? WHERE code=?',[1,code],(err, result) =>{
                            if(err || typeof result == 'undefined') {
                                reject("Désolé, le service est momentanément indisponible");
                            }else{
                                if(result.affectedRows > 0){
                                    resolve(true);
                                }else{
                                    resolve(false);
                                }
                            }
                        });
                    }

                }
            });


        })
    },
    getcode:(mail)=> {
        return new Promise((resolve, reject )=> {
            connexion.query('SELECT code FROM influenceur WHERE mail_I=? ',[mail],(err,res)=> {
                if (err) {
                    reject("Désolé, le service est momentanément indisponible");
                } else {
                    if (typeof res[0] != 'undefined') {
                        resolve(res);
                    } else {
                        connexion.query('SELECT code FROM entreprise WHERE mail_E=? ', [mail], (err, res) => {
                            if (err) {
                                reject("Désolé, le service est momentanément indisponible");
                            } else {
                                resolve(res);
                            }
                        })
                    }
                }

            })
        });
    }
};



