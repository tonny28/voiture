const connexion = require('../service/connexion')();
const service = require('../service/service');

module.exports = {
    creation: function(req, res){
        console.log("==> POST CREATION VOITURE");
        var type = req.body.type, matricule = req.body.matricule, annee_creation = req.body.annee_creation, description = req.body.description, id_user = req.body.id_user, fichier = req.files.image;
        if(type && matricule && annee_creation && description && fichier && id_user){
            connexion.then(function(dbo){
                service.findUser(false, id_user, dbo).then(function(user){
                    if(user){
                        let path_image = service.uploadfile("public/image/", fichier);
                        if(path_image){
                            dbo.collection("voiture").insertOne({type:type, matricule:matricule, annee_creation:annee_creation, description:description, path:path_image, date_ajout: new Date(), date_modification:null}, function(err){
                                if(err) return res.status(500).send({error:"Ressource"});
                                res.send({success:"Success"});
                            })
                        }
                        else{
                            res.status(500).send({error:"Ressource"});
                        }
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

    list_voiture: function(req, res){
        console.log("==> LIST VOITURE");
        connexion.then(function(dbo){
            dbo.collection("voiture").find({}, {projection:{type:1, matricule:1, annee_creation:1}}).toArray(function(err, resultats){
                if(err) return res.status(500).send({error:"Ressource"});
                if(resultats.length){
                    res.send(resultats);
                }
                else{
                    res.send([]);
                }
            })
        })
    },

    get_voiture: function(req, res){
        console.log("GET VOITURE");
        var id_user = req.query.id_user, id_voiture = req.query.id_voiture;
        if(id_user && id_voiture){
            connexion.then(function(dbo){
                service.findUser(false, id_user, dbo).then(function(user){
                    if(user){
                        service.findVoiture(id_voiture, dbo).then(function(resultat){
                            if(resultat){
                                res.send(resultat);
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
    }

}