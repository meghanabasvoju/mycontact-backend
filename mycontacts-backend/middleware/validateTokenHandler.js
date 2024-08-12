const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  //the request headers authorization token
  let authHeader = req.headers.Authorization || req.headers.authorization;
  //if the authHeader and then starts with the Bearers index 0
  if (authHeader && authHeader.startsWith("Bearer")) {
    //split the token with one space and index of [1]
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("user is not authorized");
      }
      req.user = decoded.user;
      next();

      if (!token) {
        res.status(401);
        throw new Error(
          "User is not authorized or token is missing in the request"
        );
      }
    });
  }
});

module.exports = validateToken;
