const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Auth = require('../models/auth');

const genericErrorMessage = " Please contact system admin.";
const genericErrorTitle = "Authentication-Error: "

exports.login = (req, res, next) => {
  let fetchedAuth;
  Auth.findOne({ user: req.body.user })
    .then(auth => {
      if (!auth) {
        return res.status(401).json({
          title: genericErrorTitle + "login!",
          message: "Invalid authentication!" + genericErrorMessage
        });
      }
      fetchedAuth = auth;
      return bcrypt.compare(req.body.pwd, auth.pwd);
    }).then(result => {
      if (!result) {
        return res.status(401).json({
          title: genericErrorTitle + "login!",
          message: "Invalid authentication!" + genericErrorMessage
        });
      }
      const token = jwt.sign(
        { user: fetchedAuth.user, userId: fetchedAuth._id },
        process.env.JWT_KEY,
        { expiresIn: "8h" });

        res.status(200).json({
          token: token,
          expiresIn: 28800,
          userId: fetchedAuth._id,
          name: fetchedAuth.name,
          role: fetchedAuth.role
        });
    }).catch(err => {
      console.log(err);
      return res.status(401).json({
        title: genericErrorTitle + "login!",
        message: "Invalid authentication!" + genericErrorMessage
      });
    });
}

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.pwd, 10).then(hash => {
    const user = new Auth({
      user: req.body.user,
      pwd: hash,
      role: req.body.role
    });

    user.save().then(result => {
      res.status(201).json({
        message: "User created!",
        result: result
      });
    }).catch(error => {
      console.log(error);
      res.status(500).json({
        title: genericErrorTitle + "signup!",
        message: "Invalid authentication!" + genericErrorMessage
      });
    });
  });
}
