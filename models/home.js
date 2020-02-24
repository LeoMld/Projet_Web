const cookie_mdl = require('../models/cookie');
let connexion = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



module.exports = {
    connect: async (req,res1,mail,pwd) =>{
      return new Promise((resolve,reject)=>{
          if(mail !== undefined && pwd !== undefined){
              //connexion will compare mail, pwd in database and return user data if he is in database
              connexion.query('SELECT * FROM Influenceur WHERE mail_I=?',[mail], (err, res) =>{
                  if(err){
                      cookie_mdl.destroyToken(req,res);
                      resolve(1);
                      //if there is nothing in influenceur table go search in entreprise table
                  }else if(res[0] === undefined){
                      connexion.query('SELECT * FROM entreprise WHERE mail_E=?',[mail], (err, res) => {
                          if (err) {
                              cookie_mdl.destroyToken(req,res);
                              resolve(1);
                          } else{

                              if(res[0] !== undefined){
                                  //check if it's the good password and send user data or an empty table if it's the wrong password
                                  bcrypt.compare(pwd, res[0].pwd_E, function(err, result) {
                                      if(result){
                                          const token = jwt.sign({userId: id_Entreprise, type: 2}, cookie_mdl.getKey(),{expiresIn: '1h'},);
                                          cookie_mdl.setToken(token,res1);
                                          resolve(1);
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
                      //check if it's the good password and send user data or an empty table if it's the wrong password
                      bcrypt.compare(pwd, res[0].pwd_I, function(err, result) {
                          if(result){
                              const token = jwt.sign({userId: res[0].id_Influenceur, type: 1}, cookie_mdl.getKey(),{expiresIn: '1h'},);
                              cookie_mdl.setToken(token,res1);
                              resolve(1);
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
    register_I: (name,surname,mail,pwd,date,nom_Inf) => new Promise((resolve,reject) =>{
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
                                connexion.query('INSERT INTO influenceur SET nom_I=?, prenom_I=?, date_naissance_I=?, nom_Inf=?,mail_I=?,pwd_I=?',[surname,name,date,nom_Inf,mail,hash]);
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
    register_E: (name, mail, pwd)=> new Promise((resolve,reject) => {
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
                                connexion.query('INSERT INTO entreprise SET nom_E=?, mail_E=?,pwd_E=?',[name,mail,hash]);
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



};



