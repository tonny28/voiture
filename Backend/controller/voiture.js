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

    
}