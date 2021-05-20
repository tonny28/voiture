const jwt = require('jsonwebtoken');
const SECRET = 'mykey';

function verify_token(req, res, next){
    const token = req.headers.authorization ? req.headers.authorization.replace("Accessing ", "") : false;
    // Présence d'un token
    if (!token) {
        res.status(401).json({ erreur: "Il n'y a pas de token" });
    }

    // Véracité du token
    jwt.verify(token, SECRET, (err, decodedToken) => {
        if (err) res.status(401).json({ erreur: "Mauvaise token" })
        next()
    })
}

module.exports = {
    verified: (req, res, next) => {
        verify_token(req, res, next);
    },
}