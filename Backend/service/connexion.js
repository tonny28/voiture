var MongoClient = require('mongodb').MongoClient;
var dbo;

module.exports = function() {
    return new Promise(function (resolve) {
        if(dbo){
            resolve(dbo);
        }
        else{
            MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
            if (err)throw err;
            dbo = db.db("bdd_voiture");
            process.on('exit', (code) => {
                dbClose();
            })
            resolve(dbo);
        });
        }
    })
}