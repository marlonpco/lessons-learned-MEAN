const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[2];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { user: decodedToken.user, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({
      title: "Authentication-error",
      message: "You are not authenticated!"
    });
  }
};
