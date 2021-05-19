const mongo = require('mongodb');

module.exports = {
    verification_exist_email: function(email, dbo, operation, id = null){
        return new Promise(function(resolve){
            //Si condition == "inscrire" , on vérifie si l'email n'existe pas dans la base de données
            //Sinon (si condition == "modification") , on vérifie si l'email n'est pas utilisé par d'autre utilisateur
            let condition = operation === "inscrire" ? {email:email} : {_id:{$ne: new mongo.ObjectID(id)}, email:email};
            dbo.collection("user").find(condition).toArray(function(err, resultats){
                if(err) throw(err);
                if(resultats.length){
                    resolve(true);
                }
                else{
                    resolve(false);
                }
            })
        })      
    },

    findUser: function(email, id, dbo){
        return new Promise(function(resolve){
            if(email || id){
                let condition = email ? {email:email} : {_id: new mongo.ObjectID(id)};
                dbo.collection("user").findOne(condition, function(err, resultat){
                    if(err) throw(err);
                    if(resultat){
                        resolve(resultat);
                    }
                    else{
                        resolve(false);
                    }
                })
            }
            else{
                resolve(false);
            }
        })
    }
}