const connexion = require('../service/connexion')();
const service = require('../service/service');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const SECRET = 'mykey';

module.exports = {
    index: function(req, res){
        console.log("==> GET INDEX");
        res.send("Bonjour!");
    },

    inscrire: function(req, res){
        console.log("==> POST INSCRIRE USER");
        var nom = req.body.nom, prenom = req.body.prenom, email = req.body.email, mdp1 = req.body.password, mdp2 = req.body.confirmation_password, date_inscription = new Date();
        //Verification données attendues
        if(nom && prenom && email && mdp1 && mdp2){
            connexion.then(function(dbo){
                //Verification existence email dans la base de données => false if not exist
                service.verification_exist_email(email, dbo, "inscrire").then(function(verify){
                    if(!verify){
                        if(mdp1 === mdp2){
                            bcrypt.hash(mdp1, saltRounds, function(err, hash) {
                                //Insertion dans la base de données
                                dbo.collection("user").insertOne({nom:nom, prenom:prenom, email:email, password:hash, date_inscription:date_inscription, date_modification:null}, function(err){
                                    if(err) res.status(500).send({error: "Ressource"});
                                    service.findUser(email, false, dbo).then(function(user){
                                        if(user){
                                            const token = jwt.sign({
                                                id: user._id,
                                                mail: user.email,
                                            }, SECRET, { expiresIn:'7d'})
                                            res.send({token: token, nom: user.nom, prenom: user.prenom, email: user.email});
                                        }
                                        else{
                                            res.status(403).send({error:"Utilisateur introuvable"});
                                        }
                                    })
                                })
                            });
                        }
                        else{
                            res.status(403).send({error:"Confirmation mot de passe incorrecte"});
                        }
                    }
                    else{
                        res.status(403).send({error:"Adresse email déjà utilisé"});
                    }
                })
            })
        }
        else{
            res.status(403).send({error:"Information insuffisante"});
        }
    },

    login: function(req, res){
        console.log("==> LOGIN POST");
        var email = req.body.email, mdp = req.body.password;
        if(email && mdp){
            connexion.then(function(dbo){
                service.findUser(email, false, dbo).then(function(user){
                    if(user){
                        bcrypt.compare(mdp, user.password, function(err, verification) {
                            if(verification){
                                const token = jwt.sign({
                                    id: user._id,
                                    mail: user.email,
                                }, SECRET, { expiresIn:'7d'})
                                res.send({token: token, nom: user.nom, prenom: user.prenom, email: user.email});
                            }
                            else{
                                res.status(403).send({error:"Mot de passe incorrecte"});
                            }
                        });
                    }
                    else{
                        res.status(403).send({error:"Adresse email incorrecte"});
                    }
                })
            })
        }
        else{
            res.status(403).send({error:"Information insuffisante"});
        }
    }

}