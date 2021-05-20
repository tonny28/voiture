const connexion = require('../service/connexion')();
const service = require('../service/service');
const mongo = require('mongodb');

module.exports = {
    commenter: function(req, res){
        console.log("POST COMMENTER");
        var id_user = req.body.id_user, id_voiture = req.body.id_voiture, commentaire = req.body.commentaire, date_creation = new Date();
        if(id_user && id_voiture && commentaire){
            connexion.then(function(dbo){
                service.findUser(false, id_user, dbo).then(function(user){
                    if(user){
                        service.findVoiture(id_voiture, dbo).then(function(voiture){
                            if(voiture){
                                dbo.collection("commentaire").insertOne({id_user: new mongo.ObjectID(id_user), id_voiture: new mongo.ObjectID(id_voiture), commentaire: commentaire, date_creation: date_creation, date_modification: null}, function(err){
                                    if(err) return res.status(500).send({error:"Ressource"});
                                    return res.send({success:"Success"});
                                })
                            }
                            else{
                                res.status(403).send({error:"Voiture introuvable"});
                            }
                        })
                    }
                    else{
                        res.status(403).send({error:"Utilisateur introuvable"});
                    }
                })
            })
        }
        else{
            res.status(403).send({error:"Information insuffisante"});
        }
    },

    get_voiture_commentaire: function(req, res){
        console.log("==> GET VOITURE COMMENTAIRE");
        var id_voiture = req.query.id_voiture, id_user = req.query.id_user;
        if(id_voiture){
            connexion.then(function(dbo){
                service.findVoiture(id_voiture, dbo).then(function(voiture){
                    if(voiture){
                        //S'il y a un id_user, on cherche le commentaire du voiture
                        //Sinon, on retourne le voiture seulement
                        if(id_user){
                            dbo.collection("commentaire").find({id_voiture: new mongo.ObjectID(id_voiture)}).sort({date_creation: -1}).toArray(function(err, resultats){
                                if(err) return res.status(500).send({error:"Ressource"});
                                if(resultats.length){
                                    let commentaire_user = [];
                                    for(let i = 0; i<resultats.length; i++){
                                        service.findUser(false, resultats[i].id_user, dbo).then(function(user_coms){
                                            commentaire_user.push({commentaire :resultats[i].commentaire, nom: user_coms.nom, prenom: user_coms.prenom});
                                            if(resultats.length - 1 == i){
                                                res.send({comments:commentaire_user, voiture: voiture});
                                            }
                                        })
                                    }
                                }
                                else{
                                    res.send({commentaire:resultats, voiture: voiture});
                                }
                            })
                        }
                        else{
                            res.send({commentaire:"", voiture: voiture});
                        }
                    }
                    else{
                        res.status(403).send({error:"Voiture introuvable"});
                    }
                })
            })
        }
        else{
            res.status(403).send({error:"Information insuffisante"});
        }
    }

}