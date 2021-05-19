var user = require("../controller/user");
var middleware = require("../middleware/auth");

// On injecte le router d"express, nous en avons besoin pour définir les routes 
module.exports = function(router) {   
    router.get("/", user.index);   
    router.post("/api/v1/inscrire", user.inscrire);
    router.post("/api/v1/login", user.login);
};