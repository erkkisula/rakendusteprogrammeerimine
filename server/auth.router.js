const express = require('express');
const router = express.Router();
const userController = require("./user.controller.js");
const { check, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");

const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(422).json({errors: errors.array()});
    }
    next();
};

router.post("/verify", (req, res) => {
    const bearerHeader = req.headers["authorization"];
    if(!bearerHeader) return res.send(400);
    const token = bearerHeader.split(" ")[1];
    if(!token) return res.send(400);
    jwt.verify( token, process.env.JWT_KEY, (err, decoded) => {
        if(err) {
            console.log(err);
            return res.status(401).send(err);
        }
        res.status(200).send(decoded);
    });
});

router.post("/signin", userController.signin);
//Create user
router.post("/signup", 
[
    check("email").isEmail().normalizeEmail(),
    check("password").isLength( {min:8}).withMessage("Password length has to be atleast 8 characters")
],
validationMiddleware,
userController.signup
);

module.exports = router;