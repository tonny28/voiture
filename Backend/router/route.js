var user = require("../controller/user");
var voiture = require("../controller/voiture");
var commentaire = require("../controller/comments");
var middleware = require("../middleware/auth");

// On injecte le router d"express, nous en avons besoin pour définir les routes 
module.exports = function(router) {   
    router.get("/", user.index);

    //USER
    router.post("/api/v1/inscrire", user.inscrire);
    router.post("/api/v1/login", user.login);

    //VOITURE
    router.post("/api/v1/creation", voiture.creation);
    router.get("/api/v1/list", voiture.list_voiture);
    router.get("/api/v1/get_voiture", voiture.get_voiture);

    //COMMENTAIRE
    router.post("/api/v1/commenter", commentaire.commenter);
    router.get("/api/v1/get_voiture_commentaire", commentaire.get_voiture_commentaire);
};