var user = require("../controller/user");
var voiture = require("../controller/voiture");
var middleware = require("../middleware/auth");

// On injecte le router d"express, nous en avons besoin pour définir les routes 
module.exports = function(router) {   
    router.get("/", user.index);

    //USER
    router.post("/api/v1/inscrire", user.inscrire);
    router.post("/api/v1/login", user.login);

    //VOITURE
    router.post("/api/v1/creation", voiture.creation);
};